import { writeFileSync } from 'node:fs';
import { levels } from '../src/game/levels';
import { instruments } from '../src/game/questions';
import { intervalName } from '../src/game/intervals';

const reviews = [
  'Review 1–20: wide contrasts only. Every pair of eligible intervals differs by at least two semitones; most lessons offer just two choices. Existing wide-interval lessons were moved forward.',
  'Review 21–40: introduce fine comparisons among unison, seconds, thirds and fourth (0–5 semitones). Larger intervals appear only in spaced reviews. Slow focused practice alternates with familiar wide contrasts.',
  'Review 41–60: begin neighboring larger intervals with slow two-choice lessons. The first 50 levels avoid fast playback and six-choice tasks; broader mixed pools follow from level 51.',
  'Review 61–80: combine the established interval vocabulary with timbre, direction, register and harmonic listening, interspersed with recovery lessons.',
  'Review 81–100: advanced simple-interval reviews include four gentle two-choice compound lessons at 84, 88, 94 and 96: minor ninth, major ninth, minor tenth and major tenth. Compounds are contrasted with easy, widely separated anchors.',
];
const lines = ['# Intervalify level design', '',
  'The permanent source is `src/game/levels.ts`: 100 individually authored configurations, not a procedural difficulty generator. This document is rendered from that authored list with `npm run docs:levels`.', '',
  'Every level has 10 questions. Root ranges always describe the lower note, including descending playback. Upper notes equal root + semitone distance. Speed changes melodic spacing, never pitch. Duration is independent. Mixed playback selects harmonic, ascending or descending per question.', '',
  'Difficulty labels are editorial intentions, not calibrated psychometric ratings. Listening tests with learners should inform future tuning. Every root/instrument/interval combination is validated against bundled samples.', ''];
for (let chapter = 0; chapter < 5; chapter++) {
  lines.push(`## Chapter ${chapter + 1}`, '', reviews[chapter], '');
  for (const level of levels.slice(chapter * 20, chapter * 20 + 20)) {
    lines.push(`### ${level.id}. ${level.title} — ${level.difficulty}`, '', level.challenge, '',
      `- Intervals: ${level.intervals.map((n) => `${n} (${intervalName(n)})`).join(', ')}.`,
      `- ${level.choices} choices; ${level.playback}; ${level.speed}; ${level.noteDurationMs} ms per note.`,
      `- GM programs (zero-based): ${level.instruments.map((n) => `${n} ${instruments[n].name}`).join(', ')}.`,
      `- Lower/root MIDI range: ${level.minMidiNote}–${level.maxMidiNote}.`, '');
  }
}
lines.push('## Collective review', '',
  'All chapters mix instruments, register, answer count, playback mode and tempo. Neighboring-interval lessons use fewer choices or slower notes when first introduced. Fast lessons often use easier intervals; broad pools generally return to familiar instruments. Every six-choice level has at least six eligible unique intervals. No GM sound-effect presets appear in authored lessons. Recovery labels denote intentionally reduced cognitive load relative to nearby peaks, not a guarantee of easy listening for every player.', '',
  'Pack 1 starts unlocked. Packs 2–5 require 30, 60, 90 and 120 total stars respectively; their first levels then open. Remaining levels open sequentially after one star in their predecessor within that chapter. Players may reach another pack before completing every previous level. Existing saved scores remain attached to numbered level slots; LEVEL_REORDER.md records the previous-to-new lesson order.', '');
writeFileSync('LEVEL_DESIGN.md', lines.join('\n'));
console.log(`Documented all 100 authored levels and five chapter reviews; ${new Set(levels.flatMap((level) => [...level.instruments])).size} pitched GM programs are used by the levels.`);
