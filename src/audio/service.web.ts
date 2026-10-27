import { Asset } from 'expo-asset';
import { audioBanks, noteOffsets } from './assets';
import { IntervalPlayer } from './player';
import { createWebVoice } from './webVoice';

export const intervalPlayer = new IntervalPlayer({
  initialize: async () => {},
  create(program, midi) {
    const source = audioBanks[program];
    const offset = noteOffsets[program]?.[midi];
    if (!source || offset === undefined) throw new Error(`Missing audio: program ${program}, MIDI ${midi}`);
    // Expo's web seekTo resolves before the media element's seeked event.
    return createWebVoice(new Audio(Asset.fromModule(source).uri), offset);
  },
});

export async function preloadNotes(program: number, notes: readonly number[]) {
  const source = audioBanks[program];
  for (const midi of notes) {
    if (!source || noteOffsets[program]?.[midi] === undefined) throw new Error(`Missing sample ${program}/${midi}`);
  }
  if (notes.length) await Asset.fromModule(source).downloadAsync();
}
