import { Asset } from 'expo-asset';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { audioBanks, noteOffsets } from './assets';
import { IntervalPlayer, type Voice } from './player';

let initialization: Promise<void> | undefined;

export const intervalPlayer = new IntervalPlayer({
  initialize() {
    initialization ??= setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      allowsRecording: false,
      interruptionMode: 'doNotMix',
    }).catch((error: unknown) => { initialization = undefined; throw error; });
    return initialization;
  },
  create(program, midi): Voice {
    const source = audioBanks[program];
    const offset = noteOffsets[program]?.[midi];
    if (!source || offset === undefined) throw new Error(`Missing audio: program ${program}, MIDI ${midi}`);
    const player = createAudioPlayer(source, { updateInterval: 50 });
    player.volume = 0.45; // Headroom for two simultaneous normalized notes.
    let disposed = false;
    let error: string | null = null;
    const listener = player.addListener('playbackStatusUpdate', (status) => { error = status.error; });
    return {
      async ready() {
        const started = Date.now();
        while (!disposed && !player.isLoaded) {
          if (error) throw new Error(error);
          if (Date.now() - started > 12000) throw new Error('Audio could not load. Please retry playback.');
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        if (!disposed) await player.seekTo(offset, 0, 0);
      },
      play() { if (!disposed) player.play(); },
      async fadeOut() {
        // Avoid discontinuities when a level uses a shorter duration than the sample.
        for (let step = 4; step >= 0 && !disposed; step--) {
          player.volume = 0.45 * step / 5;
          await new Promise((resolve) => setTimeout(resolve, 8));
        }
        if (!disposed) player.pause();
      },
      error: () => error,
      dispose() {
        if (disposed) return;
        disposed = true; listener.remove(); player.pause(); player.remove();
      },
    };
  },
});

export async function preloadNotes(program: number, notes: readonly number[]) {
  const source = audioBanks[program];
  for (const midi of notes) {
    if (!source || noteOffsets[program]?.[midi] === undefined) throw new Error(`Missing sample ${program}/${midi}`);
  }
  if (notes.length) await Asset.fromModule(source).downloadAsync();
}
