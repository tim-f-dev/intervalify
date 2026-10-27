# Intervalify level design

The permanent source is `src/game/levels.ts`: 100 individually authored configurations, not a procedural difficulty generator. This document is rendered from that authored list with `npm run docs:levels`.

Every level has 10 questions. Root ranges always describe the lower note, including descending playback. Upper notes equal root + semitone distance. Speed changes melodic spacing, never pitch. Duration is independent. Mixed playback selects harmonic, ascending or descending per question.

Difficulty labels are editorial intentions, not calibrated psychometric ratings. Listening tests with learners should inform future tuning. Every root/instrument/interval combination is validated against bundled samples.

## Chapter 1

Review 1–20: wide contrasts only. Every pair of eligible intervals differs by at least two semitones; most lessons offer just two choices. Existing wide-interval lessons were moved forward.

### 1. Same or soaring — gentle

Hear one pitch twice versus an octave; a narrow root range keeps the opening calm.

- Intervals: 0 (Perfect unison), 12 (Perfect octave).
- 2 choices; ascending; slow; 1000 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–65.

### 2. A brass hello — gentle

Introduce trumpet immediately, contrasting a major third with a fifth.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; ascending; slow; 1000 ms per note.
- GM programs (zero-based): 56 Trumpet.
- Lower/root MIDI range: 60–65.

### 3. Guitar steps down — steady

First descending pair; wide familiar intervals offset the new direction.

- Intervals: 7 (Perfect fifth), 12 (Perfect octave).
- 2 choices; descending; slow; 1000 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 55–62.

### 4. Together at the piano — steady

First simultaneous notes; listen for the extra pitch rather than a melody.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; harmonic; normal; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 5. Air above — gentle

A flute changes attack and register while the interval gap stays generous.

- Intervals: 4 (Major third), 12 (Perfect octave).
- 2 choices; ascending; normal; 850 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 65–72.

### 6. Cello foundations — steady

Low cello introduces bass listening without close interval distinctions.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 42 Cello.
- Lower/root MIDI range: 43–50.

### 7. A little farther — steady

Clarinet introduces major second and perfect fourth with only two choices.

- Intervals: 2 (Major second), 5 (Perfect fourth).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 71 Clarinet.
- Lower/root MIDI range: 60–67.

### 8. Bass breathing space — recovery

A low acoustic bass lesson resets difficulty after neighboring harmony.

- Intervals: 0 (Perfect unison), 12 (Perfect octave).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 32 Acoustic Bass.
- Lower/root MIDI range: 40–48.

### 9. Trumpet reprieve — recovery

Two wide brass shapes ease the load after the first six-choice lesson.

- Intervals: 5 (Perfect fourth), 12 (Perfect octave).
- 2 choices; descending; normal; 900 ms per note.
- GM programs (zero-based): 56 Trumpet.
- Lower/root MIDI range: 60–67.

### 10. Quiet low strings — recovery

Low cello returns to a third-versus-octave contrast after two busier lessons.

- Intervals: 4 (Major third), 12 (Perfect octave).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 42 Cello.
- Lower/root MIDI range: 43–50.

### 11. A clean landing — recovery

Clean electric guitar offers an easy reset with a wider root range.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; descending; normal; 900 ms per note.
- GM programs (zero-based): 27 Clean Guitar.
- Lower/root MIDI range: 55–67.

### 12. Marimba rest stop — recovery

A short-attack consonance lesson releases the prior memory load.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; harmonic; normal; 900 ms per note.
- GM programs (zero-based): 12 Marimba.
- Lower/root MIDI range: 60–72.

### 13. Harp geometry — steady

Equal four-semitone spacing makes a distinctive harp recognition task.

- Intervals: 0 (Perfect unison), 4 (Major third), 8 (Minor sixth), 12 (Perfect octave).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 46 Harp.
- Lower/root MIDI range: 55–67.

### 14. Flute horizon — recovery

Clear high flute fourths and octaves give an intentional late-chapter breather.

- Intervals: 5 (Perfect fourth), 12 (Perfect octave).
- 2 choices; ascending; slow; 1000 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 72–79.

### 15. Two soft plucks — recovery

A low guitar fourth-versus-octave break follows dense harmony and high winds.

- Intervals: 5 (Perfect fourth), 12 (Perfect octave).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 48–60.

### 16. Air and strings — recovery

A two-choice fourth/fifth contrast reduces load while retaining mixed timbres.

- Intervals: 5 (Perfect fourth), 7 (Perfect fifth).
- 2 choices; mixed; normal; 900 ms per note.
- GM programs (zero-based): 40 Violin, 73 Flute.
- Lower/root MIDI range: 60–72.

### 17. Open strings clearing — recovery

Pizzicato unisons and octaves form a deliberately easy recovery.

- Intervals: 0 (Perfect unison), 12 (Perfect octave).
- 2 choices; harmonic; normal; 900 ms per note.
- GM programs (zero-based): 45 Pizzicato Strings.
- Lower/root MIDI range: 55–67.

### 18. Trumpet sunlight — recovery

A broad two-choice trumpet lesson intentionally releases the combined demands.

- Intervals: 4 (Major third), 12 (Perfect octave).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 56 Trumpet.
- Lower/root MIDI range: 60–67.

### 19. Flute calm — recovery

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 65–72.

### 20. First crossroads — stretch

Review all three playback modes with two familiar timbres.

- Intervals: 0 (Perfect unison), 4 (Major third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 24 Nylon Guitar.
- Lower/root MIDI range: 60–67.

## Chapter 2

Review 21–40: introduce fine comparisons among unison, seconds, thirds and fourth (0–5 semitones). Larger intervals appear only in spaced reviews. Slow focused practice alternates with familiar wide contrasts.

### 21. Half-step lanterns — steady

Introduce the minor second in a bright, uncluttered celesta register.

- Intervals: 1 (Minor second), 2 (Major second).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 8 Celesta.
- Lower/root MIDI range: 65–72.

### 22. Quick wooden echoes — recovery

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 0 (Perfect unison), 12 (Perfect octave).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 12 Marimba.
- Lower/root MIDI range: 60–72.

### 23. Two shades of third — steady

Introduce the minor third beside its neighboring major third.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–64.

### 24. Four familiar shapes — stretch

Review unison, major third, fifth and octave with four clear piano choices.

- Intervals: 0 (Perfect unison), 4 (Major third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 25. High porcelain — steady

Compare small intervals carefully at a slow pace; replay the notes as often as you need.

- Intervals: 1 (Minor second), 2 (Major second).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 8 Celesta.
- Lower/root MIDI range: 79–84.

### 26. A bow between friends — steady

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 40 Violin.
- Lower/root MIDI range: 60–67.

### 27. Thirds on the way down — steady

Compare small intervals carefully at a slow pace; replay the notes as often as you need.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 25 Steel Guitar.
- Lower/root MIDI range: 55–67.

### 28. Three travelers — steady

Violin, guitar and flute share a root band; infer the interval through changing envelopes.

- Intervals: 0 (Perfect unison), 3 (Minor third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; descending; normal; 850 ms per note.
- GM programs (zero-based): 40 Violin, 24 Nylon Guitar, 73 Flute.
- Lower/root MIDI range: 60–67.

### 29. Bright crowded keys — stretch

Compare small intervals carefully at a slow pace; replay the notes as often as you need.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third).
- 4 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 4 Electric Piano 1.
- Lower/root MIDI range: 60–67.

### 30. Bells at a run — steady

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 0 (Perfect unison), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 9 Glockenspiel.
- Lower/root MIDI range: 72–79.

### 31. Smallest shadows — stretch

Compare small intervals carefully at a slow pace; replay the notes as often as you need.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third).
- 4 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 11 Vibraphone.
- Lower/root MIDI range: 60–65.

### 32. Low brass corners — steady

Tuba moves familiar shapes into its natural low register.

- Intervals: 2 (Major second), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; normal; 1000 ms per note.
- GM programs (zero-based): 58 Tuba.
- Lower/root MIDI range: 40–50.

### 33. Seconds in company — stretch

Compare small intervals carefully at a slow pace; replay the notes as often as you need.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth).
- 4 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–65.

### 34. Piccolo windows — steady

Introduce piccolo in its natural high range with familiar interval shapes.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth), 12 (Perfect octave), 4 (Major third).
- 4 choices; ascending; normal; 800 ms per note.
- GM programs (zero-based): 72 Piccolo.
- Lower/root MIDI range: 72–79.

### 35. Quick brass anchors — recovery

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 56 Trumpet.
- Lower/root MIDI range: 60–72.

### 36. Wide piano compass — stretch

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 0 (Perfect unison), 2 (Major second), 4 (Major third), 7 (Perfect fifth), 9 (Major sixth), 12 (Perfect octave).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 48–55.

### 37. Guitar lightning — steady

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 0 (Perfect unison), 3 (Minor third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; descending; normal; 900 ms per note.
- GM programs (zero-based): 24 Nylon Guitar, 27 Clean Guitar.
- Lower/root MIDI range: 55–67.

### 38. Bassoon pathways — steady

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 0 (Perfect unison), 2 (Major second), 3 (Minor third), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 70 Bassoon.
- Lower/root MIDI range: 43–55.

### 39. Harp invitation — steady

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 2 (Major second), 4 (Major third), 7 (Perfect fifth), 9 (Major sixth).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 46 Harp.
- Lower/root MIDI range: 55–62.

### 40. High wind sprint — stretch

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 0 (Perfect unison), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; descending; normal; 900 ms per note.
- GM programs (zero-based): 72 Piccolo, 73 Flute.
- Lower/root MIDI range: 72–79.

## Chapter 3

Review 41–60: begin neighboring larger intervals with slow two-choice lessons. The first 50 levels avoid fast playback and six-choice tasks; broader mixed pools follow from level 51.

### 41. The tilted fifth — stretch

Focus on just two neighboring intervals, played slowly upwards on one instrument.

- Intervals: 6 (Tritone), 7 (Perfect fifth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 11 Vibraphone.
- Lower/root MIDI range: 60–65.

### 42. Warm sixths — steady

Introduce minor and major sixths with gentle nylon guitar attacks.

- Intervals: 8 (Minor sixth), 9 (Major sixth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 55–62.

### 43. Sevenths in the reeds — steady

Focus on just two neighboring intervals, played slowly upwards on one instrument.

- Intervals: 10 (Minor seventh), 11 (Major seventh).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 68 Oboe.
- Lower/root MIDI range: 60–65.

### 44. Sixths in the air — steady

Focus on just two neighboring intervals, played slowly upwards on one instrument.

- Intervals: 8 (Minor sixth), 9 (Major sixth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 65–72.

### 45. Cello thirds return — steady

Focused low harmonic thirds provide a pause without removing fine discrimination.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 42 Cello.
- Lower/root MIDI range: 43–55.

### 46. Sevenths falling — steady

Focus on just two neighboring intervals, played slowly upwards on one instrument.

- Intervals: 10 (Minor seventh), 11 (Major seventh).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 65–72.

### 47. Sixths under glass — stretch

Focus on just two neighboring intervals, played slowly upwards on one instrument.

- Intervals: 7 (Perfect fifth), 8 (Minor sixth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 8 Celesta.
- Lower/root MIDI range: 72–79.

### 48. The moving semitone — stretch

Focus on just two neighboring intervals, played slowly upwards on one instrument.

- Intervals: 5 (Perfect fourth), 6 (Tritone).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 56 Trumpet.
- Lower/root MIDI range: 60–72.

### 49. Viola welcome — steady

Compare thirds, fourths and fifths on viola at a slow pace with four choices.

- Intervals: 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth).
- 4 choices; descending; slow; 900 ms per note.
- GM programs (zero-based): 41 Viola.
- Lower/root MIDI range: 55–67.

### 50. Cello long view — recovery

Recognize familiar intervals at an unhurried pace, with no more than four answer choices.

- Intervals: 5 (Perfect fourth), 12 (Perfect octave).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 42 Cello.
- Lower/root MIDI range: 43–50.

### 51. Six signposts — stretch

Six answer choices now bring familiar small and wide intervals together on slow piano.

- Intervals: 0 (Perfect unison), 2 (Major second), 3 (Minor third), 4 (Major third), 7 (Perfect fifth), 12 (Perfect octave).
- 6 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–65.

### 52. Almost home — stretch

Introduce both sevenths around an octave, with a fifth as an anchor.

- Intervals: 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave), 7 (Perfect fifth).
- 4 choices; ascending; slow; 1000 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 53. A fourth on either side — stretch

Build a four-note interval neighborhood around the perfect fourth.

- Intervals: 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth).
- 4 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 55–62.

### 54. Reed junction — stretch

Alto sax and clarinet mix intervals with different harmonic tensions.

- Intervals: 2 (Major second), 3 (Minor third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 10 (Minor seventh).
- 4 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 65 Alto Sax, 71 Clarinet.
- Lower/root MIDI range: 55–65.

### 55. Three ways through — stretch

Piano and violin alternate through six neighboring distances and all modes.

- Intervals: 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth).
- 6 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 40 Violin.
- Lower/root MIDI range: 60–67.

### 56. Organ dusk — stretch

Sustained low organ harmonies make the sixth-to-seventh neighborhood demanding.

- Intervals: 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh).
- 4 choices; harmonic; slow; 1200 ms per note.
- GM programs (zero-based): 19 Church Organ.
- Lower/root MIDI range: 48–60.

### 57. A wooden switch — stretch

Marimba and xylophone alternate narrow seconds and wider tension pairs.

- Intervals: 1 (Minor second), 2 (Major second), 5 (Perfect fourth), 6 (Tritone).
- 4 choices; mixed; fast; 500 ms per note.
- GM programs (zero-based): 12 Marimba, 13 Xylophone.
- Lower/root MIDI range: 60–72.

### 58. Accordion angles — stretch

Accordion introduces a rich reed spectrum with six deliberately uneven distances.

- Intervals: 1 (Minor second), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 8 (Minor sixth), 11 (Major seventh).
- 6 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 21 Accordion.
- Lower/root MIDI range: 55–65.

### 59. Eleven neighboring doors — expert

Every non-unison simple interval except octave can appear among six choices.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh).
- 6 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 60. Third mosaic — stretch

Four core timbres revisit a broad interval pool with changing playback modes.

- Intervals: 0 (Perfect unison), 1 (Minor second), 3 (Minor third), 4 (Major third), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 24 Nylon Guitar, 40 Violin, 73 Flute.
- Lower/root MIDI range: 60–72.

## Chapter 4

Review 61–80: combine the established interval vocabulary with timbre, direction, register and harmonic listening, interspersed with recovery lessons.

### 61. Opening mosaic — steady

Chapter review mixes timbres and modes but uses a mostly consonant pool.

- Intervals: 0 (Perfect unison), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 40 Violin, 73 Flute.
- Lower/root MIDI range: 60–67.

### 62. Piano flashcards — stretch

Six familiar intervals return at a faster pace.

- Intervals: 0 (Perfect unison), 2 (Major second), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 6 choices; ascending; fast; 450 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 63. Near the octave — stretch

Six upper intervals compete; slow piano keeps their contour clear.

- Intervals: 7 (Perfect fifth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave), 8 (Minor sixth).
- 6 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–65.

### 64. Bass under pressure — stretch

Low finger bass combines neighbor intervals, changing modes and shorter notes.

- Intervals: 3 (Minor third), 4 (Major third), 6 (Tritone), 7 (Perfect fifth).
- 4 choices; mixed; fast; 600 ms per note.
- GM programs (zero-based): 33 Finger Bass.
- Lower/root MIDI range: 40–50.

### 65. Second mosaic — stretch

A six-choice review samples both close and wide intervals without rushing.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 6 (Tritone), 7 (Perfect fifth), 10 (Minor seventh), 12 (Perfect octave).
- 6 choices; mixed; normal; 900 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 56 Trumpet, 24 Nylon Guitar.
- Lower/root MIDI range: 60–67.

### 66. Low harmonic labyrinth — expert

Six tight harmonic intervals in low piano and cello need patient separation.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone).
- 6 choices; harmonic; slow; 1200 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 42 Cello.
- Lower/root MIDI range: 43–55.

### 67. Around the sixth — stretch

Steel guitar compares a continuous six-interval neighborhood.

- Intervals: 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh).
- 6 choices; descending; normal; 850 ms per note.
- GM programs (zero-based): 25 Steel Guitar.
- Lower/root MIDI range: 55–67.

### 68. Double-reed shadows — expert

Oboe and English horn mix less familiar distances while allowing long listening.

- Intervals: 1 (Minor second), 3 (Minor third), 6 (Tritone), 8 (Minor sixth), 10 (Minor seventh), 11 (Major seventh).
- 6 choices; mixed; slow; 1100 ms per note.
- GM programs (zero-based): 68 Oboe, 69 English Horn.
- Lower/root MIDI range: 55–67.

### 69. Clavinet corners — steady

Short clavinet attacks offer a rhythmic challenge with mostly obvious shapes.

- Intervals: 0 (Perfect unison), 2 (Major second), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; fast; 350 ms per note.
- GM programs (zero-based): 7 Clavinet.
- Lower/root MIDI range: 60–72.

### 70. Two bass colors — steady

Compare neighboring thirds across acoustic and fretless bass without harmony.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; descending; normal; 1000 ms per note.
- GM programs (zero-based): 32 Acoustic Bass, 35 Fretless Bass.
- Lower/root MIDI range: 36–48.

### 71. Choir intervals — stretch

Slow choir attacks require sustained attention to simultaneous pitch distance.

- Intervals: 0 (Perfect unison), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth), 9 (Major sixth), 12 (Perfect octave).
- 6 choices; harmonic; slow; 1200 ms per note.
- GM programs (zero-based): 52 Choir Aahs.
- Lower/root MIDI range: 60–67.

### 72. Nylon reset — recovery

An intentionally simple mixed-mode lesson follows the unfamiliar choir.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; mixed; normal; 900 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 48–67.

### 73. All thirteen — expert

First complete simple-interval pool, anchored by a single familiar instrument.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; ascending; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 55–72.

### 74. Muted brass twins — stretch

A focused seventh comparison introduces muted trumpet with ample duration.

- Intervals: 10 (Minor seventh), 11 (Major seventh).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 59 Muted Trumpet.
- Lower/root MIDI range: 60–67.

### 75. Celesta zigzag — expert

High celesta, six choices and fast mode changes combine three demands.

- Intervals: 1 (Minor second), 2 (Major second), 4 (Major third), 6 (Tritone), 8 (Minor sixth), 12 (Perfect octave).
- 6 choices; mixed; fast; 500 ms per note.
- GM programs (zero-based): 8 Celesta.
- Lower/root MIDI range: 65–79.

### 76. Saxophone neighbors — stretch

Alto and tenor sax blend adjacent small harmonic intervals.

- Intervals: 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth).
- 4 choices; harmonic; normal; 1000 ms per note.
- GM programs (zero-based): 65 Alto Sax, 66 Tenor Sax.
- Lower/root MIDI range: 55–67.

### 77. Marimba spectrum — expert

A wide root range prevents memorizing one marimba contour per answer.

- Intervals: 0 (Perfect unison), 1 (Minor second), 3 (Minor third), 5 (Perfect fourth), 7 (Perfect fifth), 8 (Minor sixth), 10 (Minor seventh), 12 (Perfect octave).
- 6 choices; descending; fast; 450 ms per note.
- GM programs (zero-based): 12 Marimba.
- Lower/root MIDI range: 48–72.

### 78. Organ pillars — steady

Return to open intervals after the previous speed and transposition challenge.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth), 12 (Perfect octave), 5 (Perfect fourth).
- 4 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 16 Drawbar Organ.
- Lower/root MIDI range: 48–60.

### 79. Half-step relay — stretch

Only seconds compete, but four timbres and every mode keep the lesson varied.

- Intervals: 1 (Minor second), 2 (Major second).
- 2 choices; mixed; fast; 450 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 24 Nylon Guitar, 40 Violin, 73 Flute.
- Lower/root MIDI range: 60–72.

### 80. Fourth mosaic — expert

Complete simple-interval coverage across keys, brass, strings and clarinet.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 56 Trumpet, 40 Violin, 71 Clarinet.
- Lower/root MIDI range: 60–72.

## Chapter 5

Review 81–100: advanced simple-interval reviews include four gentle two-choice compound lessons at 84, 88, 94 and 96: minor ninth, major ninth, minor tenth and major tenth. Compounds are contrasted with easy, widely separated anchors.

### 81. A clear entrance — steady

Vibraphone opens the last chapter with four familiar shapes and a clear contour.

- Intervals: 0 (Perfect unison), 3 (Minor third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 11 Vibraphone.
- Lower/root MIDI range: 60–72.

### 82. Crowded upper strings — expert

Dense wide-interval harmonies alternate violin and viola near their upper register.

- Intervals: 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; harmonic; slow; 1200 ms per note.
- GM programs (zero-based): 40 Violin, 41 Viola.
- Lower/root MIDI range: 60–72.

### 83. Trumpet in motion — expert

A fast descending brass survey spans changing roots and seven possible distances.

- Intervals: 0 (Perfect unison), 2 (Major second), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth), 9 (Major sixth), 12 (Perfect octave).
- 6 choices; descending; fast; 400 ms per note.
- GM programs (zero-based): 56 Trumpet.
- Lower/root MIDI range: 54–72.

### 84. Guitar shelter — recovery

Compare unison with a minor ninth on slow nylon guitar; just two clear choices.

- Intervals: 0 (Perfect unison), 13 (Minor ninth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 48–55.

### 85. Black-key neighbors — expert

Acoustic and electric pianos contrast six close distances at fast pace.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone).
- 6 choices; mixed; fast; 500 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 4 Electric Piano 1.
- Lower/root MIDI range: 55–72.

### 86. Piccolo fine print — stretch

Upper-register piccolo narrows the focus to the octave and its neighbors.

- Intervals: 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave), 9 (Major sixth).
- 4 choices; ascending; normal; 850 ms per note.
- GM programs (zero-based): 72 Piccolo.
- Lower/root MIDI range: 72–84.

### 87. Bass octave puzzle — expert

Low bass timbres and mixed modes challenge pitch separation over a broad pool.

- Intervals: 0 (Perfect unison), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth), 10 (Minor seventh), 12 (Perfect octave).
- 6 choices; mixed; slow; 1100 ms per note.
- GM programs (zero-based): 32 Acoustic Bass, 33 Finger Bass.
- Lower/root MIDI range: 36–55.

### 88. Harp breathing room — recovery

Compare a perfect fifth with a major ninth on slow harp; two widely separated choices.

- Intervals: 7 (Perfect fifth), 14 (Major ninth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 46 Harp.
- Lower/root MIDI range: 55–62.

### 89. Reed close-up — expert

Oboe and clarinet combine close harmony with six distractor candidates.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 6 (Tritone), 7 (Perfect fifth).
- 6 choices; harmonic; normal; 1100 ms per note.
- GM programs (zero-based): 68 Oboe, 71 Clarinet.
- Lower/root MIDI range: 60–72.

### 90. Across the keyboard — expert

The full interval pool spans three piano octaves at fast speed.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; mixed; fast; 450 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 43–79.

### 91. Flute thirds revisit — recovery

An unhurried third comparison creates a clear reset after the broad piano test.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 60–79.

### 92. Metal and wood — expert

Celesta, vibraphone and marimba demand recognition across different decays.

- Intervals: 1 (Minor second), 3 (Minor third), 5 (Perfect fourth), 6 (Tritone), 8 (Minor sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 8 Celesta, 11 Vibraphone, 12 Marimba.
- Lower/root MIDI range: 60–72.

### 93. String seconds sprint — stretch

Fast bowed and pizzicato strings concentrate on small descending intervals.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third).
- 4 choices; descending; fast; 350 ms per note.
- GM programs (zero-based): 40 Violin, 45 Pizzicato Strings.
- Lower/root MIDI range: 60–72.

### 94. Beyond the octave — recovery

Introduce the minor tenth against unison on slow piano, with only two choices.

- Intervals: 0 (Perfect unison), 15 (Minor tenth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 48–55.

### 95. Low brass return — recovery

Two consonant tuba harmonies ease the load after compound intervals.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 58 Tuba.
- Lower/root MIDI range: 40–55.

### 96. Compound air — recovery

Introduce the major tenth against a perfect fifth on slow flute, with two clear choices.

- Intervals: 7 (Perfect fifth), 16 (Major tenth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 60–67.

### 97. Chamber crossroads — expert

Five familiar chamber colors cover every simple interval with changing modes.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; mixed; normal; 900 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 24 Nylon Guitar, 40 Violin, 73 Flute, 71 Clarinet.
- Lower/root MIDI range: 60–72.

### 98. The last quick pair — stretch

A tiny pool hides a precise tritone/fifth distinction under fast mode changes.

- Intervals: 6 (Tritone), 7 (Perfect fifth).
- 2 choices; mixed; fast; 350 ms per note.
- GM programs (zero-based): 56 Trumpet, 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–72.

### 99. One quiet breath — recovery

Return to opening consonances for a calm, intentional penultimate level.

- Intervals: 0 (Perfect unison), 4 (Major third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 55–67.

### 100. Intervalify finale — expert

Final synthesis: all simple intervals, five timbres, all modes and six choices; compounds remain a separate skill.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; mixed; fast; 550 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 24 Nylon Guitar, 40 Violin, 56 Trumpet, 73 Flute.
- Lower/root MIDI range: 60–72.

## Collective review

All chapters mix instruments, register, answer count, playback mode and tempo. Neighboring-interval lessons use fewer choices or slower notes when first introduced. Fast lessons often use easier intervals; broad pools generally return to familiar instruments. Every six-choice level has at least six eligible unique intervals. No GM sound-effect presets appear in authored lessons. Recovery labels denote intentionally reduced cognitive load relative to nearby peaks, not a guarantee of easy listening for every player.

Pack 1 starts unlocked. Packs 2–5 require 30, 60, 90 and 120 total stars respectively; their first levels then open. Remaining levels open sequentially after one star in their predecessor within that chapter. Players may reach another pack before completing every previous level. Existing saved scores remain attached to numbered level slots; LEVEL_REORDER.md records the previous-to-new lesson order.
