# Intervalify level design

The permanent source is `src/game/levels.ts`: 100 individually authored configurations, not a procedural difficulty generator. This document is rendered from that authored list with `npm run docs:levels`.

Every level has 10 questions. Root ranges always describe the lower note, including descending playback. Upper notes equal root + semitone distance. Speed changes melodic spacing, never pitch. Duration is independent. Mixed playback selects harmonic, ascending or descending per question.

Difficulty labels are editorial intentions, not calibrated psychometric ratings. Listening tests with learners should inform future tuning. Every root/instrument/interval combination is validated against bundled samples.

## Chapter 1

Review 1–20: all core mechanics appear in the opening ten. New interval families arrive in small focused pools. Levels 5, 14 and 17 provide relief; 16 is the first six-choice peak. Level 20 mixes timbres without using the full interval pool.

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

### 3. Four familiar shapes — stretch

First four-choice lesson combines only the opening consonances.

- Intervals: 0 (Perfect unison), 4 (Major third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 4. Guitar steps down — steady

First descending pair; wide familiar intervals offset the new direction.

- Intervals: 7 (Perfect fifth), 12 (Perfect octave).
- 2 choices; descending; slow; 1000 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 55–62.

### 5. Quick wooden echoes — recovery

Introduce fast playback with unmistakably different unison and octave.

- Intervals: 0 (Perfect unison), 12 (Perfect octave).
- 2 choices; ascending; fast; 420 ms per note.
- GM programs (zero-based): 12 Marimba.
- Lower/root MIDI range: 60–72.

### 6. Together at the piano — steady

First simultaneous notes; listen for the extra pitch rather than a melody.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; harmonic; normal; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 7. Air above — gentle

A flute changes attack and register while the interval gap stays generous.

- Intervals: 4 (Major third), 12 (Perfect octave).
- 2 choices; ascending; normal; 850 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 65–72.

### 8. Cello foundations — steady

Low cello introduces bass listening without close interval distinctions.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 42 Cello.
- Lower/root MIDI range: 43–50.

### 9. A bow between friends — steady

Violin and shorter notes require attention to pitch instead of attack.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; ascending; fast; 550 ms per note.
- GM programs (zero-based): 40 Violin.
- Lower/root MIDI range: 60–67.

### 10. First crossroads — stretch

Review all three playback modes with two familiar timbres.

- Intervals: 0 (Perfect unison), 4 (Major third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 24 Nylon Guitar.
- Lower/root MIDI range: 60–67.

### 11. Two shades of third — steady

Introduce the minor third beside its neighboring major third.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–64.

### 12. A little farther — steady

Clarinet introduces major second and perfect fourth with only two choices.

- Intervals: 2 (Major second), 5 (Perfect fourth).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 71 Clarinet.
- Lower/root MIDI range: 60–67.

### 13. The tilted fifth — stretch

Contrast a tritone with a perfect fifth in sustained vibraphone harmony.

- Intervals: 6 (Tritone), 7 (Perfect fifth).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 11 Vibraphone.
- Lower/root MIDI range: 60–65.

### 14. Bass breathing space — recovery

A low acoustic bass lesson resets difficulty after neighboring harmony.

- Intervals: 0 (Perfect unison), 12 (Perfect octave).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 32 Acoustic Bass.
- Lower/root MIDI range: 40–48.

### 15. Half-step lanterns — steady

Introduce the minor second in a bright, uncluttered celesta register.

- Intervals: 1 (Minor second), 2 (Major second).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 8 Celesta.
- Lower/root MIDI range: 65–72.

### 16. Six signposts — stretch

First six-choice level; slow piano isolates answer recognition from timbre.

- Intervals: 0 (Perfect unison), 2 (Major second), 3 (Minor third), 4 (Major third), 7 (Perfect fifth), 12 (Perfect octave).
- 6 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–65.

### 17. Trumpet reprieve — recovery

Two wide brass shapes ease the load after the first six-choice lesson.

- Intervals: 5 (Perfect fourth), 12 (Perfect octave).
- 2 choices; descending; normal; 900 ms per note.
- GM programs (zero-based): 56 Trumpet.
- Lower/root MIDI range: 60–67.

### 18. Warm sixths — steady

Introduce minor and major sixths with gentle nylon guitar attacks.

- Intervals: 8 (Minor sixth), 9 (Major sixth).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 55–62.

### 19. Almost home — stretch

Introduce both sevenths around an octave, with a fifth as an anchor.

- Intervals: 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave), 7 (Perfect fifth).
- 4 choices; ascending; slow; 1000 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 20. Opening mosaic — steady

Chapter review mixes timbres and modes but uses a mostly consonant pool.

- Intervals: 0 (Perfect unison), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 40 Violin, 73 Flute.
- Lower/root MIDI range: 60–67.

## Chapter 2

Review 21–40: neighboring distances, high bells and low bass alternate with broader reviews. Levels 29, 34 and 39 are explicit recoveries. Level 40 increases pool breadth without increasing playback speed.

### 21. Sevenths in the reeds — steady

Oboe and descending sevenths start the chapter with a focused two-choice contrast.

- Intervals: 10 (Minor seventh), 11 (Major seventh).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 68 Oboe.
- Lower/root MIDI range: 60–65.

### 22. Bright crowded keys — stretch

Electric piano groups four close small intervals without harmonic masking.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third).
- 4 choices; ascending; normal; 850 ms per note.
- GM programs (zero-based): 4 Electric Piano 1.
- Lower/root MIDI range: 60–67.

### 23. Bells at a run — steady

A high glockenspiel makes speed the main challenge with separated intervals.

- Intervals: 0 (Perfect unison), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; fast; 400 ms per note.
- GM programs (zero-based): 9 Glockenspiel.
- Lower/root MIDI range: 72–79.

### 24. Quiet low strings — recovery

Low cello returns to a third-versus-octave contrast after two busier lessons.

- Intervals: 4 (Major third), 12 (Perfect octave).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 42 Cello.
- Lower/root MIDI range: 43–50.

### 25. A fourth on either side — stretch

Build a four-note interval neighborhood around the perfect fourth.

- Intervals: 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth).
- 4 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 55–62.

### 26. Three travelers — steady

Violin, guitar and flute share a root band; infer the interval through changing envelopes.

- Intervals: 0 (Perfect unison), 3 (Minor third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; descending; normal; 850 ms per note.
- GM programs (zero-based): 40 Violin, 24 Nylon Guitar, 73 Flute.
- Lower/root MIDI range: 60–67.

### 27. Sixths in the air — steady

A focused harmonic sixth lesson offsets unfamiliar flute blend with a small pool.

- Intervals: 8 (Minor sixth), 9 (Major sixth).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 65–72.

### 28. Piano flashcards — stretch

Six familiar intervals return at a faster pace.

- Intervals: 0 (Perfect unison), 2 (Major second), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 6 choices; ascending; fast; 450 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–67.

### 29. A clean landing — recovery

Clean electric guitar offers an easy reset with a wider root range.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; descending; normal; 900 ms per note.
- GM programs (zero-based): 27 Clean Guitar.
- Lower/root MIDI range: 55–67.

### 30. Smallest shadows — stretch

Hear close harmonic distances under a ringing vibraphone decay.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third).
- 4 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 11 Vibraphone.
- Lower/root MIDI range: 60–65.

### 31. Low brass corners — steady

Tuba moves familiar shapes into its natural low register.

- Intervals: 2 (Major second), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; normal; 1000 ms per note.
- GM programs (zero-based): 58 Tuba.
- Lower/root MIDI range: 40–50.

### 32. Thirds on the way down — steady

Fast steel guitar narrows the task to neighboring thirds.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; descending; fast; 550 ms per note.
- GM programs (zero-based): 25 Steel Guitar.
- Lower/root MIDI range: 55–67.

### 33. Near the octave — stretch

Six upper intervals compete; slow piano keeps their contour clear.

- Intervals: 7 (Perfect fifth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave), 8 (Minor sixth).
- 6 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–65.

### 34. Marimba rest stop — recovery

A short-attack consonance lesson releases the prior memory load.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; harmonic; normal; 900 ms per note.
- GM programs (zero-based): 12 Marimba.
- Lower/root MIDI range: 60–72.

### 35. Reed junction — stretch

Alto sax and clarinet mix intervals with different harmonic tensions.

- Intervals: 2 (Major second), 3 (Minor third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 10 (Minor seventh).
- 4 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 65 Alto Sax, 71 Clarinet.
- Lower/root MIDI range: 55–65.

### 36. High porcelain — steady

Very high celesta seconds ask for careful direction-independent hearing.

- Intervals: 1 (Minor second), 2 (Major second).
- 2 choices; descending; slow; 1000 ms per note.
- GM programs (zero-based): 8 Celesta.
- Lower/root MIDI range: 79–84.

### 37. Harp geometry — steady

Equal four-semitone spacing makes a distinctive harp recognition task.

- Intervals: 0 (Perfect unison), 4 (Major third), 8 (Minor sixth), 12 (Perfect octave).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 46 Harp.
- Lower/root MIDI range: 55–67.

### 38. Bass under pressure — stretch

Low finger bass combines neighbor intervals, changing modes and shorter notes.

- Intervals: 3 (Minor third), 4 (Major third), 6 (Tritone), 7 (Perfect fifth).
- 4 choices; mixed; fast; 600 ms per note.
- GM programs (zero-based): 33 Finger Bass.
- Lower/root MIDI range: 40–50.

### 39. Flute horizon — recovery

Clear high flute fourths and octaves give an intentional late-chapter breather.

- Intervals: 5 (Perfect fourth), 12 (Perfect octave).
- 2 choices; ascending; slow; 1000 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 72–79.

### 40. Second mosaic — stretch

A six-choice review samples both close and wide intervals without rushing.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 6 (Tritone), 7 (Perfect fifth), 10 (Minor seventh), 12 (Perfect octave).
- 6 choices; mixed; normal; 900 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 56 Trumpet, 24 Nylon Guitar.
- Lower/root MIDI range: 60–67.

## Chapter 3

Review 41–60: introduce piccolo, organ, accordion and bassoon between familiar instruments. Level 50 broadens transposition, while 59 is a difficult single-timbre pool challenge. Recoveries at 44, 47, 54 and 58 keep the chapter uneven by design.

### 41. Viola welcome — steady

Viola opens with a manageable pool while widening the root band.

- Intervals: 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth).
- 4 choices; descending; normal; 900 ms per note.
- GM programs (zero-based): 41 Viola.
- Lower/root MIDI range: 55–67.

### 42. Seconds in company — stretch

Six small harmonic intervals need sustained listening rather than contour memory.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth).
- 6 choices; harmonic; slow; 1200 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 60–65.

### 43. Piccolo windows — steady

Introduce piccolo in its natural high range with familiar interval shapes.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth), 12 (Perfect octave), 4 (Major third).
- 4 choices; ascending; normal; 800 ms per note.
- GM programs (zero-based): 72 Piccolo.
- Lower/root MIDI range: 72–79.

### 44. Two soft plucks — recovery

A low guitar fourth-versus-octave break follows dense harmony and high winds.

- Intervals: 5 (Perfect fourth), 12 (Perfect octave).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 48–60.

### 45. Three ways through — stretch

Piano and violin alternate through six neighboring distances and all modes.

- Intervals: 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth).
- 6 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 40 Violin.
- Lower/root MIDI range: 60–67.

### 46. Organ dusk — stretch

Sustained low organ harmonies make the sixth-to-seventh neighborhood demanding.

- Intervals: 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh).
- 4 choices; harmonic; slow; 1200 ms per note.
- GM programs (zero-based): 19 Church Organ.
- Lower/root MIDI range: 48–60.

### 47. Quick brass anchors — recovery

A tiny familiar pool keeps a very short-note trumpet sprint approachable.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; ascending; fast; 350 ms per note.
- GM programs (zero-based): 56 Trumpet.
- Lower/root MIDI range: 60–72.

### 48. Sevenths falling — steady

Flute compares the octave with its three nearest lower wide intervals.

- Intervals: 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 4 choices; descending; normal; 850 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 65–79.

### 49. A wooden switch — stretch

Marimba and xylophone alternate narrow seconds and wider tension pairs.

- Intervals: 1 (Minor second), 2 (Major second), 5 (Perfect fourth), 6 (Tritone).
- 4 choices; mixed; fast; 500 ms per note.
- GM programs (zero-based): 12 Marimba, 13 Xylophone.
- Lower/root MIDI range: 60–72.

### 50. Wide piano compass — stretch

The root spans nearly three octaves; interval identity must survive transposition.

- Intervals: 0 (Perfect unison), 2 (Major second), 4 (Major third), 7 (Perfect fifth), 9 (Major sixth), 12 (Perfect octave).
- 6 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 48–79.

### 51. Cello thirds return — steady

Focused low harmonic thirds provide a pause without removing fine discrimination.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 42 Cello.
- Lower/root MIDI range: 43–55.

### 52. Accordion angles — stretch

Accordion introduces a rich reed spectrum with six deliberately uneven distances.

- Intervals: 1 (Minor second), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 8 (Minor sixth), 11 (Major seventh).
- 6 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 21 Accordion.
- Lower/root MIDI range: 55–65.

### 53. Guitar lightning — steady

Short guitar attacks support a fast review of separated shapes.

- Intervals: 0 (Perfect unison), 3 (Minor third), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; descending; fast; 400 ms per note.
- GM programs (zero-based): 24 Nylon Guitar, 27 Clean Guitar.
- Lower/root MIDI range: 55–67.

### 54. Air and strings — recovery

A two-choice fourth/fifth contrast reduces load while retaining mixed timbres.

- Intervals: 5 (Perfect fourth), 7 (Perfect fifth).
- 2 choices; mixed; normal; 900 ms per note.
- GM programs (zero-based): 40 Violin, 73 Flute.
- Lower/root MIDI range: 60–72.

### 55. Sixths under glass — stretch

Bright upper-register celesta harmonies crowd around both sixths.

- Intervals: 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh).
- 4 choices; harmonic; normal; 1000 ms per note.
- GM programs (zero-based): 8 Celesta.
- Lower/root MIDI range: 72–79.

### 56. Bassoon pathways — steady

A low bassoon contour lesson expands the timbre palette at a forgiving pace.

- Intervals: 0 (Perfect unison), 2 (Major second), 3 (Minor third), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 6 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 70 Bassoon.
- Lower/root MIDI range: 43–55.

### 57. The moving semitone — stretch

Fast fourth/tritone discrimination changes between piano and trumpet.

- Intervals: 5 (Perfect fourth), 6 (Tritone).
- 2 choices; ascending; fast; 450 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 56 Trumpet.
- Lower/root MIDI range: 60–72.

### 58. Open strings clearing — recovery

Pizzicato unisons and octaves form a deliberately easy recovery.

- Intervals: 0 (Perfect unison), 12 (Perfect octave).
- 2 choices; harmonic; normal; 900 ms per note.
- GM programs (zero-based): 45 Pizzicato Strings.
- Lower/root MIDI range: 55–67.

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

Review 61–80: combine close harmony, register and timbre demands. Levels 64, 70, 74 and 79 release pressure. The complete simple-interval pool appears in 71, then returns across multiple timbres in 80.

### 61. Harp invitation — steady

The chapter starts with a transparent plucked timbre and four spaced distances.

- Intervals: 2 (Major second), 4 (Major third), 7 (Perfect fifth), 9 (Major sixth).
- 4 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 46 Harp.
- Lower/root MIDI range: 55–72.

### 62. Low harmonic labyrinth — expert

Six tight harmonic intervals in low piano and cello need patient separation.

- Intervals: 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone).
- 6 choices; harmonic; slow; 1200 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 42 Cello.
- Lower/root MIDI range: 43–55.

### 63. High wind sprint — stretch

Piccolo and flute descend quickly through familiar wide intervals.

- Intervals: 0 (Perfect unison), 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; descending; fast; 400 ms per note.
- GM programs (zero-based): 72 Piccolo, 73 Flute.
- Lower/root MIDI range: 72–79.

### 64. Trumpet sunlight — recovery

A broad two-choice trumpet lesson intentionally releases the combined demands.

- Intervals: 4 (Major third), 12 (Perfect octave).
- 2 choices; ascending; slow; 1100 ms per note.
- GM programs (zero-based): 56 Trumpet.
- Lower/root MIDI range: 60–67.

### 65. Around the sixth — stretch

Steel guitar compares a continuous six-interval neighborhood.

- Intervals: 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh).
- 6 choices; descending; normal; 850 ms per note.
- GM programs (zero-based): 25 Steel Guitar.
- Lower/root MIDI range: 55–67.

### 66. Double-reed shadows — expert

Oboe and English horn mix less familiar distances while allowing long listening.

- Intervals: 1 (Minor second), 3 (Minor third), 6 (Tritone), 8 (Minor sixth), 10 (Minor seventh), 11 (Major seventh).
- 6 choices; mixed; slow; 1100 ms per note.
- GM programs (zero-based): 68 Oboe, 69 English Horn.
- Lower/root MIDI range: 55–67.

### 67. Clavinet corners — steady

Short clavinet attacks offer a rhythmic challenge with mostly obvious shapes.

- Intervals: 0 (Perfect unison), 2 (Major second), 7 (Perfect fifth), 12 (Perfect octave).
- 4 choices; ascending; fast; 350 ms per note.
- GM programs (zero-based): 7 Clavinet.
- Lower/root MIDI range: 60–72.

### 68. Two bass colors — steady

Compare neighboring thirds across acoustic and fretless bass without harmony.

- Intervals: 3 (Minor third), 4 (Major third).
- 2 choices; descending; normal; 1000 ms per note.
- GM programs (zero-based): 32 Acoustic Bass, 35 Fretless Bass.
- Lower/root MIDI range: 36–48.

### 69. Choir intervals — stretch

Slow choir attacks require sustained attention to simultaneous pitch distance.

- Intervals: 0 (Perfect unison), 4 (Major third), 5 (Perfect fourth), 7 (Perfect fifth), 9 (Major sixth), 12 (Perfect octave).
- 6 choices; harmonic; slow; 1200 ms per note.
- GM programs (zero-based): 52 Choir Aahs.
- Lower/root MIDI range: 60–67.

### 70. Nylon reset — recovery

An intentionally simple mixed-mode lesson follows the unfamiliar choir.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth).
- 2 choices; mixed; normal; 900 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 48–67.

### 71. All thirteen — expert

First complete simple-interval pool, anchored by a single familiar instrument.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; ascending; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 55–72.

### 72. Muted brass twins — stretch

A focused seventh comparison introduces muted trumpet with ample duration.

- Intervals: 10 (Minor seventh), 11 (Major seventh).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 59 Muted Trumpet.
- Lower/root MIDI range: 60–67.

### 73. Celesta zigzag — expert

High celesta, six choices and fast mode changes combine three demands.

- Intervals: 1 (Minor second), 2 (Major second), 4 (Major third), 6 (Tritone), 8 (Minor sixth), 12 (Perfect octave).
- 6 choices; mixed; fast; 500 ms per note.
- GM programs (zero-based): 8 Celesta.
- Lower/root MIDI range: 65–79.

### 74. Cello long view — recovery

Long low cello notes and wide choices restore confidence after the sprint.

- Intervals: 5 (Perfect fourth), 12 (Perfect octave).
- 2 choices; descending; slow; 1100 ms per note.
- GM programs (zero-based): 42 Cello.
- Lower/root MIDI range: 43–60.

### 75. Saxophone neighbors — stretch

Alto and tenor sax blend adjacent small harmonic intervals.

- Intervals: 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth).
- 4 choices; harmonic; normal; 1000 ms per note.
- GM programs (zero-based): 65 Alto Sax, 66 Tenor Sax.
- Lower/root MIDI range: 55–67.

### 76. Marimba spectrum — expert

A wide root range prevents memorizing one marimba contour per answer.

- Intervals: 0 (Perfect unison), 1 (Minor second), 3 (Minor third), 5 (Perfect fourth), 7 (Perfect fifth), 8 (Minor sixth), 10 (Minor seventh), 12 (Perfect octave).
- 6 choices; descending; fast; 450 ms per note.
- GM programs (zero-based): 12 Marimba.
- Lower/root MIDI range: 48–72.

### 77. Organ pillars — steady

Return to open intervals after the previous speed and transposition challenge.

- Intervals: 0 (Perfect unison), 7 (Perfect fifth), 12 (Perfect octave), 5 (Perfect fourth).
- 4 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 16 Drawbar Organ.
- Lower/root MIDI range: 48–60.

### 78. Half-step relay — stretch

Only seconds compete, but four timbres and every mode keep the lesson varied.

- Intervals: 1 (Minor second), 2 (Major second).
- 2 choices; mixed; fast; 450 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 24 Nylon Guitar, 40 Violin, 73 Flute.
- Lower/root MIDI range: 60–72.

### 79. Flute calm — recovery

An easy melodic third/fifth contrast creates space before the chapter review.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; ascending; normal; 900 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 65–79.

### 80. Fourth mosaic — expert

Complete simple-interval coverage across keys, brass, strings and clarinet.

- Intervals: 0 (Perfect unison), 1 (Minor second), 2 (Major second), 3 (Minor third), 4 (Major third), 5 (Perfect fourth), 6 (Tritone), 7 (Perfect fifth), 8 (Minor sixth), 9 (Major sixth), 10 (Minor seventh), 11 (Major seventh), 12 (Perfect octave).
- 6 choices; mixed; normal; 850 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano, 56 Trumpet, 40 Violin, 71 Clarinet.
- Lower/root MIDI range: 60–72.

## Chapter 5

Review 81–100: demanding combinations alternate with deliberate relief at 84, 88, 91, 95 and 99. Compound intervals are introduced slowly in 94 and revisited in 96; the finale tests simple-interval fluency rather than surprising the player with new material.

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

A deliberately easy octave/unison harmony break keeps the final chapter humane.

- Intervals: 0 (Perfect unison), 12 (Perfect octave).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 24 Nylon Guitar.
- Lower/root MIDI range: 48–67.

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

Familiar fourths and fifths offer recovery in a bright plucked timbre.

- Intervals: 5 (Perfect fourth), 7 (Perfect fifth).
- 2 choices; descending; normal; 900 ms per note.
- GM programs (zero-based): 46 Harp.
- Lower/root MIDI range: 55–72.

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

### 94. Beyond the octave — stretch

Introduce twelfth and double octave beside their simple fifth and octave anchors.

- Intervals: 7 (Perfect fifth), 12 (Perfect octave), 19 (19-semitone interval), 24 (24-semitone interval).
- 4 choices; ascending; slow; 1200 ms per note.
- GM programs (zero-based): 0 Acoustic Grand Piano.
- Lower/root MIDI range: 48–60.

### 95. Low brass return — recovery

Two consonant tuba harmonies ease the load after compound intervals.

- Intervals: 4 (Major third), 7 (Perfect fifth).
- 2 choices; harmonic; slow; 1100 ms per note.
- GM programs (zero-based): 58 Tuba.
- Lower/root MIDI range: 40–55.

### 96. Compound air — expert

Flute contrasts simple and compound fourths, fifths and octaves.

- Intervals: 5 (Perfect fourth), 7 (Perfect fifth), 12 (Perfect octave), 17 (17-semitone interval), 19 (19-semitone interval), 24 (24-semitone interval).
- 6 choices; descending; normal; 1000 ms per note.
- GM programs (zero-based): 73 Flute.
- Lower/root MIDI range: 60–72.

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

Chapter 1 starts unlocked. Each next chapter requires 20 stars in its immediately preceding chapter; its first level then opens. Remaining levels open sequentially after one star in their predecessor within that chapter. Thus players may reach a new chapter before completing every previous level; this is the explicit star-gate interpretation used by the engine.
