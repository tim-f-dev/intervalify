import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { AppState, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { intervalPlayer } from '../../audio/service';
import type { IntervalSound } from '../../audio/player';
import { Button, colors, Page, ui } from '../../components/ui';
import { useScreenLayout } from '../../components/useLayout';
import { useGame } from '../../game/context';
import { localizedInterval } from '../../localization/core';
import { useTranslation } from 'react-i18next';
import { getLevel } from '../../game/levels';
import { chapterOf } from '../../game/progress';
import { createQuestion } from '../../game/questions';
import type { LevelConfig, Question } from '../../game/types';
import { useTutorial } from '../../tutorial/provider';
import LevelTutorial from '../../components/LevelTutorial';
import { tutorialStage } from '../../tutorial/session';

export default function PlayRoute() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress, ready } = useGame();
  const tutorial = useTutorial();
  const level = getLevel(Number(id));
  if (!ready) return <Page><Text style={ui.body}>{t('common.loading')}</Text></Page>;
  if (!level || !progress.unlockedLevels.includes(level.id)) return <Page>
    <Text style={ui.heading}>{t('exercise.unavailable')}</Text><Button onPress={() => router.replace('/levels')}>{t('nav.map')}</Button>
  </Page>;
  if (tutorialStage(tutorial) === 'loading') return <Page><Text style={ui.body}>{t('common.loading')}</Text></Page>;
  if (tutorialStage(tutorial) === 'tutorial') return <Page>
    <Text role="heading" style={ui.heading}>{t(`${level.id}.title`, { ns: 'levels' })}</Text>
    <LevelTutorial />
  </Page>;
  return <Exercise key={level.id} level={level} />;
}
function Exercise({ level }: { level: LevelConfig }) {
  const { t } = useTranslation();
  const { dense, landscape } = useScreenLayout();
  const compactLandscape = landscape && dense;
  const { finish } = useGame();
  const history = useRef<number[]>([]);
  const [question, setQuestion] = useState(() => createQuestion(level));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const answerLock = useRef(false);
  const advancedQuestion = useRef<Question | null>(null);
  const [score, setScore] = useState(0);
  const [answerResults, setAnswerResults] = useState<boolean[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
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
      if (version === playbackVersion.current) setAudioError('errors.audioPlayback');
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
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: menuOpen }} onPress={() => setMenuOpen(true)} style={styles.headerButton}><Text style={styles.headerText}>{t('nav.menu')}</Text></Pressable>
    <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)} supportedOrientations={['portrait', 'landscape']}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View accessibilityViewIsModal style={[ui.card, { width: '100%', maxWidth: 400, padding: 20, gap: 12 }]}>
          <Text role="heading" style={ui.heading}>{t('nav.menu')}</Text>
          <Button secondary onPress={() => { setMenuOpen(false); router.replace(('/packs/' + chapterOf(level.id)) as '/packs/1'); }}>{t('packs.backToPack')}</Button>
          <Button secondary onPress={() => { setMenuOpen(false); restart(); }}>{t('nav.restart')}</Button>
          <Button secondary onPress={() => { setMenuOpen(false); router.replace('/'); }}>{t('nav.home')}</Button>
          <Button onPress={() => setMenuOpen(false)}>{t('nav.resume')}</Button>
        </View>
      </View>
    </Modal>
  </View>} footer={<View style={{ gap: 8, flexDirection: landscape ? 'row' : 'column', alignItems: landscape ? 'center' : undefined }}>
    <Text accessibilityLiveRegion="polite" style={[ui.small, { flex: landscape ? 1 : undefined, color: selected === null ? colors.muted : correct ? colors.green : colors.red }]}>
      {selected === null ? t('exercise.choose') : t(correct ? 'exercise.correct' : 'exercise.incorrect', { interval: localizedInterval(t, question.interval) })}
    </Text>
    <View style={{ width: landscape ? 230 : undefined }}><Button large onPress={next} disabled={selected === null}>{t(index === 9 ? 'exercise.results' : 'exercise.next')}</Button></View>
  </View>}>
    <Text style={ui.eyebrow}>{t('exercise.question', { level: level.id, question: index + 1, total: level.questionCount })}</Text>
    <Text role="heading" style={[ui.heading, dense && { fontSize: 17, lineHeight: 21 }]}>{t(`${level.id}.title`, { ns: 'levels' })}</Text>
    <View accessibilityLiveRegion="polite" style={styles.tracker}>
      {Array.from({ length: level.questionCount }, (_, questionIndex) => {
        const result = answerResults[questionIndex];
        const status = result === undefined ? 'unanswered' : result ? 'correct' : 'incorrect';
        return <View key={questionIndex} accessible accessibilityLabel={t('exercise.tracker', { number: questionIndex + 1, status: t(`exercise.status.${status}`) })}
          style={[styles.trackerBox, dense && { height: 24 }, result === true && styles.trackerCorrect, result === false && styles.trackerWrong]}>
          <Text style={[styles.trackerNumber, result !== undefined && styles.trackerAnswered]}>{questionIndex + 1}</Text>
        </View>;
      })}
    </View>
    <View style={{ flex: 1, minHeight: 0, flexDirection: compactLandscape ? 'row' : 'column', gap: 8, justifyContent: 'center' }}>
    <View style={[ui.card, { flex: compactLandscape ? 1 : undefined, minHeight: 0, alignItems: 'center', justifyContent: 'center', padding: dense ? 8 : 16, gap: dense ? 4 : 8 }]}>
      <Text style={[ui.eyebrow, { textAlign: 'center' }]}>{t(String(question.program), { ns: 'instruments' })}</Text>
      {!dense && <Text style={[ui.heading, { fontSize: 20, textAlign: 'center' }]}>{t('exercise.prompt')}</Text>}
      <Text style={ui.small}>{t(`exercise.${question.playback}`)}</Text>
      <Button onPress={() => { void play(); }} disabled={playing}>{t(playing ? 'exercise.listening' : 'exercise.replay')}</Button>
      {audioError && <Text accessibilityLiveRegion="polite" style={[ui.body, { color: colors.red }]}>{t(audioError)}</Text>}
    </View>
    <View style={[styles.answers, { flex: compactLandscape ? 1 : undefined, alignContent: 'center' }]}>
      {question.choices.map((value) => {
        const answered = selected !== null;
        const isCorrect = answered && value === question.interval;
        const isWrong = answered && value === selected && !correct;
        return <Pressable key={value} onPress={() => answer(value)} disabled={answered}
          accessibilityRole="button" accessibilityState={{ disabled: answered, selected: selected === value }}
          style={({ pressed }) => [styles.answer, dense && { minHeight: 56, padding: 10 }, compactLandscape && { flexBasis: question.choices.length === 6 ? '30%' : '45%' }, isCorrect && styles.correct, isWrong && styles.wrong, pressed && { opacity: 0.7 }]}>
          <Text style={[styles.answerText, dense && { fontSize: 16 }, isCorrect && { color: colors.green }, isWrong && { color: colors.red }]}>
            {isCorrect ? '✓ ' : isWrong ? '✕ ' : ''}{localizedInterval(t, value)}
          </Text>
        </Pressable>;
      })}
    </View>
    </View>
  </Page>;
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  headerButton: { minHeight: 44, flexShrink: 1, justifyContent: 'center', paddingHorizontal: 8 },
  headerText: { color: colors.green, fontSize: 14, fontWeight: '700' },
  tracker: { flexDirection: 'row', gap: 4 },
  trackerBox: { flex: 1, minWidth: 0, height: 32, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.pale, borderWidth: 1, borderColor: colors.border },
  trackerCorrect: { backgroundColor: colors.green, borderColor: colors.green },
  trackerWrong: { backgroundColor: colors.red, borderColor: colors.red },
  trackerNumber: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  trackerAnswered: { color: '#FFFFFF' },
  answers: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  answer: { minHeight: 76, flexGrow: 1, flexBasis: '45%', justifyContent: 'center', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper },
  answerText: { color: colors.ink, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  correct: { borderColor: colors.green, backgroundColor: colors.pale },
  wrong: { borderColor: colors.red, backgroundColor: colors.pink },
});
