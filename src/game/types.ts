import type { Playback, Speed } from '../audio/player';

export type LevelConfig = Readonly<{
  id: number;
  title: string;
  instruments: readonly number[]; // Zero-based General MIDI programs.
  intervals: readonly number[];
  choices: 2 | 4 | 6;
  playback: Playback | 'mixed';
  speed: Speed;
  minMidiNote: number; // Range of the lower/root note, even for descending intervals.
  maxMidiNote: number;
  noteDurationMs: number;
  questionCount: 10;
  difficulty: 'gentle' | 'steady' | 'stretch' | 'recovery' | 'expert';
  challenge: string;
}>;

export type Question = Readonly<{
  interval: number;
  root: number;
  notes: readonly [number, number];
  program: number;
  playback: Playback;
  choices: readonly number[];
}>;
