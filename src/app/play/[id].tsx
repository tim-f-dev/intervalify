import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { intervalPlayer } from '../../audio/service';
import type { IntervalSound } from '../../audio/player';
import { Button, colors, Page, ui } from '../../components/ui';
import { useGame } from '../../game/context';
import { intervalName } from '../../game/intervals';
import { getLevel } from '../../game/levels';
import { createQuestion, instruments } from '../../game/questions';
import type { LevelConfig, Question } from '../../game/types';

export default function PlayRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress, ready } = useGame();
  const level = getLevel(Number(id));
  if (!ready) return <Page><Text style={ui.body}>Loading…</Text></Page>;
  if (!level || !progress.unlockedLevels.includes(level.id)) return <Page>
    <Text style={ui.heading}>This level is not available yet.</Text><Button onPress={() => router.replace('/levels')}>Level map</Button>
  </Page>;
  return <Exercise key={level.id} level={level} />;
}
function Exercise({ level }: { level: LevelConfig }) {
  const { finish } = useGame();
  const history = useRef<number[]>([]);
  const [question, setQuestion] = useState(() => createQuestion(level));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const answerLock = useRef(false);
  const advancedQuestion = useRef<Question | null>(null);
  const [score, setScore] = useState(0);
  const [answerResults, setAnswerResults] = useState<boolean[]>([]);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const sound: IntervalSound = useMemo(() => ({ program: question.program, notes: question.notes,
    playback: question.playback, speed: level.speed, noteDurationMs: level.noteDurationMs }), [question, level]);
  const playbackVersion = useRef(0);
  const play = useCallback(async () => {
    const version = ++playbackVersion.current;
    setPlaying(true); setAudioError(null);
    try {
      await intervalPlayer.play(sound);
    } catch {
      if (version === playbackVersion.current) setAudioError('Sound could not play. Check your volume and tap Replay to try again.');
    } finally { if (version === playbackVersion.current) setPlaying(false); }
  }, [sound]);
  useFocusEffect(useCallback(() => {
    void play();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') { playbackVersion.current++; intervalPlayer.stop(); setPlaying(false); }
    });
    return () => { playbackVersion.current++; intervalPlayer.stop(); subscription.remove(); };
  }, [play]));
  function answer(value: number) {
    if (answerLock.current) return;
    answerLock.current = true; setSelected(value);
    setAnswerResults((results) => [...results, value === question.interval]);
    if (value === question.interval) setScore((n) => n + 1);
  }
  function next() {
    if (selected === null || advancedQuestion.current === question) return;
    advancedQuestion.current = question; intervalPlayer.stop();
    if (index === level.questionCount - 1) { finish(level.id, score); router.replace('/results'); return; }
    history.current.push(question.interval); setQuestion(createQuestion(level, history.current));
    setIndex((n) => n + 1); setSelected(null); answerLock.current = false;
  }
  function restart() {
    playbackVersion.current++; intervalPlayer.stop();
    history.current = []; answerLock.current = false; advancedQuestion.current = null;
    setIndex(0); setScore(0); setAnswerResults([]); setSelected(null); setAudioError(null); setPlaying(false);
    setQuestion(createQuestion(level));
  }
  const correct = selected === question.interval;
  return <Page compact header={<View style={styles.header}>
    <Pressable accessibilityRole="button" onPress={() => router.replace('/levels')} style={styles.headerButton}><Text style={styles.headerText}>← Level map</Text></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Restart level" onPress={restart} style={styles.headerButton}><Text style={styles.headerText}>↻ Restart level</Text></Pressable>
  </View>} footer={<View style={{ gap: 8 }}>
    <Text accessibilityLiveRegion="polite" style={[ui.small, { color: selected === null ? colors.muted : correct ? colors.green : colors.red }]}>
      {selected === null ? 'Choose an answer whenever you’re ready.' : `${correct ? 'Correct!' : 'Not quite.'} ${intervalName(question.interval)}.`}
    </Text>
    <Button onPress={next} disabled={selected === null}>{index === 9 ? 'See results →' : 'Next question →'}</Button>
  </View>}>
    <Text style={ui.eyebrow}>Level {level.id} · Question {index + 1} / 10</Text>
    <Text role="heading" style={ui.heading}>{level.title}</Text>
    <View accessibilityLiveRegion="polite" style={styles.tracker}>
      {Array.from({ length: level.questionCount }, (_, questionIndex) => {
        const result = answerResults[questionIndex];
        const status = result === undefined ? 'unanswered' : result ? 'correct' : 'incorrect';
        return <View key={questionIndex} accessibilityLabel={`Question ${questionIndex + 1}: ${status}`}
          style={[styles.trackerBox, result === true && styles.trackerCorrect, result === false && styles.trackerWrong]}>
          <Text style={[styles.trackerNumber, result !== undefined && styles.trackerAnswered]}>{questionIndex + 1}</Text>
        </View>;
      })}
    </View>
    <View style={[ui.card, { alignItems: 'center', padding: 16, gap: 8 }]}>
      <Text style={ui.eyebrow}>{instruments[question.program].name}</Text>
      <Text style={[ui.heading, { fontSize: 20 }]}>What interval do you hear?</Text>
      <Text style={ui.small}>{question.playback === 'harmonic' ? 'Two notes together' : `${question.playback === 'ascending' ? 'Ascending' : 'Descending'} notes`}</Text>
      <Button onPress={() => { void play(); }} disabled={playing}>{playing ? 'Listening…' : '↻ Replay interval'}</Button>
      {audioError && <Text accessibilityLiveRegion="polite" style={[ui.body, { color: colors.red }]}>{audioError}</Text>}
    </View>
    <View style={styles.answers}>
      {question.choices.map((value) => {
        const answered = selected !== null;
        const isCorrect = answered && value === question.interval;
        const isWrong = answered && value === selected && !correct;
        return <Pressable key={value} onPress={() => answer(value)} disabled={answered}
          accessibilityRole="button" accessibilityState={{ disabled: answered, selected: selected === value }}
          style={({ pressed }) => [styles.answer, isCorrect && styles.correct, isWrong && styles.wrong, pressed && { opacity: 0.7 }]}>
          <Text style={[styles.answerText, isCorrect && { color: colors.green }, isWrong && { color: colors.red }]}>
            {isCorrect ? '✓ ' : isWrong ? '✕ ' : ''}{intervalName(value)}
          </Text>
        </Pressable>;
      })}
    </View>
  </Page>;
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  headerText: { color: colors.green, fontSize: 14, fontWeight: '700' },
  tracker: { flexDirection: 'row', direction: 'ltr', gap: 4 },
  trackerBox: { flex: 1, minWidth: 0, height: 32, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.pale, borderWidth: 1, borderColor: colors.border },
  trackerCorrect: { backgroundColor: colors.green, borderColor: colors.green },
  trackerWrong: { backgroundColor: colors.red, borderColor: colors.red },
  trackerNumber: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  trackerAnswered: { color: '#FFFFFF' },
  answers: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  answer: { minHeight: 56, flexGrow: 1, flexBasis: '45%', justifyContent: 'center', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper },
  answerText: { color: colors.ink, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  correct: { borderColor: colors.green, backgroundColor: colors.pale },
  wrong: { borderColor: colors.red, backgroundColor: colors.pink },
});
