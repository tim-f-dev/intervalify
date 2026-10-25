"""Render pinned MS Basic SF3 via libfluidsynth; encode AAC/M4A with FFmpeg.

pip install numpy imageio-ffmpeg==0.6.0
python scripts/render-audio.py --soundfont PATH --library PATH_TO_FLUIDSYNTH_DLL
On Linux/macOS --library can be the system libfluidsynth shared library.
"""
import argparse
import ctypes as C
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.audio-tools/python'))
import numpy as np  # noqa: E402
import imageio_ffmpeg  # noqa: E402

NAMES = ('Acoustic Grand Piano|Bright Piano|Electric Grand Piano|Honky Tonk Piano|Electric Piano 1|Electric Piano 2|Harpsichord|Clavinet|Celesta|Glockenspiel|Music Box|Vibraphone|Marimba|Xylophone|Tubular Bells|Dulcimer|Drawbar Organ|Percussive Organ|Rock Organ|Church Organ|Reed Organ|Accordion|Harmonica|Tango Accordion|Nylon Guitar|Steel Guitar|Jazz Guitar|Clean Guitar|Muted Guitar|Overdriven Guitar|Distortion Guitar|Guitar Harmonics|Acoustic Bass|Finger Bass|Pick Bass|Fretless Bass|Slap Bass 1|Slap Bass 2|Synth Bass 1|Synth Bass 2|Violin|Viola|Cello|Contrabass|Tremolo Strings|Pizzicato Strings|Harp|Timpani|Strings 1|Strings 2|Synth Strings 1|Synth Strings 2|Choir Aahs|Voice Oohs|Synth Voice|Orchestra Hit|Trumpet|Trombone|Tuba|Muted Trumpet|French Horn|Brass Section|Synth Brass 1|Synth Brass 2|Soprano Sax|Alto Sax|Tenor Sax|Baritone Sax|Oboe|English Horn|Bassoon|Clarinet|Piccolo|Flute|Recorder|Pan Flute|Blown Bottle|Shakuhachi|Whistle|Ocarina|Square Lead|Saw Lead|Calliope Lead|Chiff Lead|Charang Lead|Voice Lead|Fifths Lead|Bass Lead|New Age Pad|Warm Pad|Polysynth Pad|Choir Pad|Bowed Pad|Metallic Pad|Halo Pad|Sweep Pad|Rain FX|Soundtrack FX|Crystal FX|Atmosphere FX|Brightness FX|Goblins FX|Echoes FX|Sci Fi FX|Sitar|Banjo|Shamisen|Koto|Kalimba|Bagpipe|Fiddle|Shanai|Tinkle Bell|Agogo|Steel Drums|Woodblock|Taiko Drum|Melodic Tom|Synth Drum|Reverse Cymbal|Guitar Fret Noise|Breath Noise|Seashore|Bird Tweet|Telephone|Helicopter|Applause|Gunshot').split('|')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--soundfont', required=True)
    ap.add_argument('--library', required=True)
    args = ap.parse_args()
    sf = Path(args.soundfont)
    expected = '5ea2375e8bd7d8e71def1036978c1621e85b66934169b6a2744b27b9b3c2d99c'
    if hashlib.sha256(sf.read_bytes()).hexdigest() != expected:
        raise ValueError('Unexpected SoundFont; verify provenance before changing checksum')
    library = Path(args.library).resolve()
    dll_dir = os.add_dll_directory(str(library.parent)) if os.name == 'nt' else None
    lib = C.CDLL(str(library))
    def bind(name, result, *params):
        f = getattr(lib, name); f.restype = result; f.argtypes = params; return f
    ptr, integer, string = C.c_void_p, C.c_int, C.c_char_p
    settings = bind('new_fluid_settings', ptr)()
    bind('fluid_settings_setnum', integer, ptr, string, C.c_double)(settings, b'synth.sample-rate', 32000)
    for key in (b'synth.reverb.active', b'synth.chorus.active'):
        bind('fluid_settings_setint', integer, ptr, string, integer)(settings, key, 0)
    synth = bind('new_fluid_synth', ptr, ptr)(settings)
    sfid = bind('fluid_synth_sfload', integer, ptr, string, integer)(synth, str(sf.resolve()).encode(), 1)
    if sfid < 0: raise RuntimeError('SoundFont load failed')
    select = bind('fluid_synth_program_select', integer, ptr, integer, integer, integer, integer)
    on = bind('fluid_synth_noteon', integer, ptr, integer, integer, integer)
    off = bind('fluid_synth_all_sounds_off', integer, ptr, integer)
    write = bind('fluid_synth_write_float', integer, ptr, integer, ptr, integer, integer, ptr, integer, integer)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    manifest, stats, pending, banks = {}, [], [], []
    count = 0
    def encode(path, samples):
        if path.exists(): return
        subprocess.run([ffmpeg, '-v', 'error', '-y', '-f', 'f32le', '-ar', '32000', '-ac', '1', '-i', 'pipe:0', '-c:a', 'aac', '-b:a', '48k', '-movflags', '+faststart', str(path)], input=samples.tobytes(), check=True, stdout=subprocess.DEVNULL)
    with ThreadPoolExecutor(max_workers=4) as pool:
        for program, name in enumerate(NAMES):
            # Full core register for pitched sounds; bass/cello extended down, winds up.
            low = 36 if program in (0, 24, 32, 33, 34, 35, 42, 43, 58, 70) else 48
            high = 96 if program in (0, 8, 9, 72, 73, 74, 78) else 84
            if program in (32, 33, 34, 35, 43, 58): high = 67
            if program in (42, 70): high = 79
            if program in (40, 110): low = 55
            if program == 56: low = 54
            if program in (73, 74): low = 60
            if program == 72: low = 72
            folder = ROOT / 'assets/audio/banks'
            folder.mkdir(parents=True, exist_ok=True)
            manifest[program] = {'name': name, 'minMidi': low, 'maxMidi': high}
            if select(synth, 0, sfid, 0, program) != 0: raise RuntimeError(f'Missing GM program {program}')
            bank_samples = []
            path = folder / f'{program:03}.m4a'
            for note in range(low, high + 1):
                off(synth, 0)
                on(synth, 0, note, 96)
                frames = 48000  # 1.5 s at 32 kHz, trimmed and faded below.
                left = np.zeros(frames, dtype=np.float32); right = left.copy()
                write(synth, frames, left.ctypes.data, 0, 1, right.ctypes.data, 0, 1)
                samples = (left + right) * 0.5
                # Remove only leading near-silence; never crop the musical attack.
                active = np.flatnonzero(np.abs(samples) > 0.0001)
                if not len(active): raise RuntimeError(f'Silent program {program}, MIDI {note}')
                start = max(0, int(active[0]) - 64)
                samples = samples[start:]
                rms = float(np.sqrt(np.mean(samples[:24000] ** 2)))
                gain = min(0.12 / max(rms, 1e-7), 0.8 / max(float(np.max(np.abs(samples))), 1e-7))
                samples *= gain
                samples[:96] *= np.linspace(0, 1, 96)
                samples[-3200:] *= np.linspace(1, 0, 3200)
                slot = np.zeros(51200, dtype=np.float32)  # Fixed 1.6-second seeking slots.
                slot[:len(samples)] = samples
                bank_samples.append(slot)
                stats.append({'program': program, 'midi': note, 'offsetSeconds': round((note - low) * 1.6, 3), 'peak': float(np.max(np.abs(samples))), 'rms': rms * gain, 'file': str(path.relative_to(ROOT)).replace('\\', '/')})
                count += 1
            pending.append(pool.submit(encode, path, np.concatenate(bank_samples)))
            # Bound queued PCM memory on low-RAM machines.
            for task in pending: task.result()
            pending.clear()
            banks.append({'program': program, 'file': str(path.relative_to(ROOT)).replace('\\', '/'), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
            print(f'{program:03} {name}: MIDI {low}-{high}', flush=True)
    out = ROOT / 'src/audio'; out.mkdir(parents=True, exist_ok=True)
    (out / 'catalog.json').write_text(json.dumps(manifest, indent=2) + '\n')
    lines = ['// Generated by scripts/render-audio.py. Do not edit.', 'export const audioBanks: Record<number, number> = {']
    for bank in banks:
        lines.append(f"  {bank['program']}: require('../../{bank['file']}'),")
    lines.append('};\nexport const noteOffsets: Record<number, Record<number, number>> = {')
    for program, instrument in manifest.items():
        lines.append(f'  {program}: {{')
        for note in range(instrument['minMidi'], instrument['maxMidi'] + 1):
            lines.append(f'    {note}: {round((note - instrument["minMidi"]) * 1.6, 3)},')
        lines.append('  },')
    lines.append('};\n')
    (out / 'assets.ts').write_text('\n'.join(lines))
    expected_paths = {str((ROOT / sample['file']).resolve()) for sample in stats}
    for path in (ROOT / 'assets/audio').rglob('*.m4a'):
        if str(path.resolve()) not in expected_paths:
            path.unlink()  # Only obsolete generated note files inside assets/audio.
    (ROOT / 'assets/audio/render-report.json').write_text(json.dumps({'soundfontSha256': expected, 'sampleRate': 32000, 'slotSeconds': 1.6, 'count': count, 'banks': banks, 'samples': stats}, indent=2))
    print(f'{count} assets, {sum(p.stat().st_size for p in (ROOT / "assets/audio").rglob("*.m4a")) / 1024**2:.2f} MiB', flush=True)
    bind('delete_fluid_synth', None, ptr)(synth)
    bind('delete_fluid_settings', None, ptr)(settings)
    if dll_dir: dll_dir.close()

if __name__ == '__main__': main()
