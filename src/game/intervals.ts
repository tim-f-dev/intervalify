export const INTERVALS = [
  'Perfect unison', 'Minor second', 'Major second', 'Minor third', 'Major third',
  'Perfect fourth', 'Tritone', 'Perfect fifth', 'Minor sixth', 'Major sixth',
  'Minor seventh', 'Major seventh', 'Perfect octave',
  'Minor ninth', 'Major ninth', 'Minor tenth', 'Major tenth',
] as const;

export function intervalName(semitones: number): string {
  return INTERVALS[semitones] ?? `${semitones}-semitone interval`;
}
export function semitoneDistance(firstMidi: number, secondMidi: number): number {
  return Math.abs(secondMidi - firstMidi);
}
export function midiFrequency(midi: number): number { return 440 * 2 ** ((midi - 69) / 12); }
