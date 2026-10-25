import { writeFileSync } from 'node:fs';
import { levels } from '../src/game/levels';
import { instruments } from '../src/game/questions';
import { intervalName } from '../src/game/intervals';

const reviews = [
  'Review 1–20: all core mechanics appear in the opening ten. New interval families arrive in small focused pools. Levels 5, 14 and 17 provide relief; 16 is the first six-choice peak. Level 20 mixes timbres without using the full interval pool.',
  'Review 21–40: neighboring distances, high bells and low bass alternate with broader reviews. Levels 29, 34 and 39 are explicit recoveries. Level 40 increases pool breadth without increasing playback speed.',
  'Review 41–60: introduce piccolo, organ, accordion and bassoon between familiar instruments. Level 50 broadens transposition, while 59 is a difficult single-timbre pool challenge. Recoveries at 44, 47, 54 and 58 keep the chapter uneven by design.',
  'Review 61–80: combine close harmony, register and timbre demands. Levels 64, 70, 74 and 79 release pressure. The complete simple-interval pool appears in 71, then returns across multiple timbres in 80.',
  'Review 81–100: demanding combinations alternate with deliberate relief at 84, 88, 91, 95 and 99. Compound intervals are introduced slowly in 94 and revisited in 96; the finale tests simple-interval fluency rather than surprising the player with new material.',
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
  'Chapter 1 starts unlocked. Each next chapter requires 20 stars in its immediately preceding chapter; its first level then opens. Remaining levels open sequentially after one star in their predecessor within that chapter. Thus players may reach a new chapter before completing every previous level; this is the explicit star-gate interpretation used by the engine.', '');
writeFileSync('LEVEL_DESIGN.md', lines.join('\n'));
console.log(`Documented all 100 authored levels and five chapter reviews; ${new Set(levels.flatMap((level) => [...level.instruments])).size} pitched GM programs are used by the levels.`);
