"""Verify every bundled sample; --decode additionally decodes the full library."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.audio-tools/python'))
import numpy as np  # noqa: E402
import imageio_ffmpeg  # noqa: E402

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--decode', action='store_true'); args = ap.parse_args()
    report_path = ROOT / 'assets/audio/render-report.json'
    report = json.loads(report_path.read_text())
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    errors = []
    for bank in report['banks']:
        path = ROOT / bank['file']
        if not path.is_file(): errors.append(f'Missing {path}'); continue
        data = path.read_bytes()
        if len(data) < 1000 or any(tag not in data for tag in (b'ftyp', b'moov', b'mdat')):
            errors.append(f'Invalid M4A container {path}')
        digest = hashlib.sha256(data).hexdigest()
        if digest != bank['sha256']: errors.append(f'Checksum mismatch {path}')
    for sample in report['samples']:
        if sample['peak'] > 0.801 or sample['rms'] < 0.00001: errors.append(f'Invalid level {sample["program"]}/{sample["midi"]}')
    if args.decode:
        # Decode every compressed packet; errors are fatal, including a truncated stream.
        def decode(bank):
            result = subprocess.run([ffmpeg, '-v', 'error', '-xerror', '-i', str(ROOT / bank['file']), '-f', 'f32le', '-ac', '1', '-ar', '32000', '-'], capture_output=True)
            if result.returncode or result.stderr: return bank['file']
            signal = np.frombuffer(result.stdout, dtype=np.float32)
            slots = [s for s in report['samples'] if s['program'] == bank['program']]
            for sample in slots:
                start = round(sample['offsetSeconds'] * 32000)
                note = signal[start:start + 48000]
                if len(note) < 47000 or np.sqrt(np.mean(note ** 2)) < 0.00001 or np.max(np.abs(note)) >= 0.99:
                    return f'Bad decoded note {bank["program"]}/{sample["midi"]}'
            return None
        with ThreadPoolExecutor(max_workers=4) as pool:
            errors.extend(x for x in pool.map(decode, report['banks']) if x)
    # Verify concert pitch against the spectral peak near each expected fundamental.
    pitch_checks = []
    for program in (0, 24, 73):
        for midi in (48, 60, 69, 72, 84):
            sample = next((s for s in report['samples'] if s['program'] == program and s['midi'] == midi), None)
            if sample is None: continue
            file = ROOT / sample['file']
            raw = subprocess.check_output([ffmpeg, '-v', 'error', '-i', str(file), '-ss', str(sample['offsetSeconds']), '-t', '1.5', '-f', 'f32le', '-ac', '1', '-ar', '32000', '-'])
            signal = np.frombuffer(raw, dtype=np.float32)[3200:24000]
            spectrum = np.abs(np.fft.rfft(signal * np.hanning(len(signal)), n=262144))
            freq = np.fft.rfftfreq(262144, 1 / 32000)
            target = 440 * 2 ** ((midi - 69) / 12)
            mask = (freq > target * 0.94) & (freq < target * 1.06)
            peak = float(freq[mask][np.argmax(spectrum[mask])])
            cents = float(1200 * np.log2(peak / target))
            pitch_checks.append({'program': program, 'midi': midi, 'centsError': round(cents, 2)})
            if abs(cents) > 35: errors.append(f'Pitch error {program}/{midi}: {cents:.1f} cents')
    size = sum((ROOT / b['file']).stat().st_size for b in report['banks'])
    result = {'assets': len(report['samples']), 'bytes': size, 'decodedAll': args.decode, 'pitchChecks': pitch_checks, 'errors': errors}
    (ROOT / 'assets/audio/verification.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))
    if errors: raise SystemExit(1)

if __name__ == '__main__': main()
