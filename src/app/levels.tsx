import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, colors, Page, Stars, ui } from '../components/ui';
import { useGame } from '../game/context';
import { levels } from '../game/levels';
import { CHAPTER_STAR_REQUIREMENT } from '../game/progress';
import { useTranslation } from 'react-i18next';

export default function LevelMap() {
  const { t } = useTranslation();
  const { progress } = useGame();
  return <Page>
    <Button secondary onPress={() => router.replace('/')}>{t('nav.home')}</Button>
    <Text style={ui.eyebrow}>{t('map.eyebrow')}</Text>
    <Text role="heading" style={ui.title}>{t('map.title')}</Text>
    <Text style={ui.body}>{t('map.instructions', { required: CHAPTER_STAR_REQUIREMENT })}</Text>
    {progress.chapters.map((chapter, chapterIndex) => <View key={chapter.id} style={ui.card}>
      <Text style={ui.eyebrow}>{t('map.chapterProgress', { id: chapter.id, count: chapter.stars })}</Text>
      <Text role="heading" style={ui.heading}>{t(`chapters.${chapter.id}`)}</Text>
      {!chapter.unlocked && <Text style={ui.body}>{t('map.chapterLocked', { required: CHAPTER_STAR_REQUIREMENT, previous: chapter.id - 1, earned: progress.chapters[chapterIndex - 1].stars })}</Text>}
      <View style={styles.path}>
        {levels.slice(chapterIndex * 20, chapterIndex * 20 + 20).map((level, index) => {
          const unlocked = progress.unlockedLevels.includes(level.id);
          const stars = progress.best[level.id]?.stars ?? 0;
          return <View key={level.id} style={[styles.node, { transform: [{ translateX: [0, 28, 46, 28, 0, -28, -46, -28][index % 8] }] }]}>
            {index > 0 && <View style={styles.connector} />}
            <Pressable disabled={!unlocked} onPress={() => router.push(`/play/${level.id}`)}
              accessibilityRole="button" accessibilityLabel={t('common.levelLabel', { id: level.id, title: t(`${level.id}.title`, { ns: 'levels' }), status: unlocked ? t('common.starCount', { count: stars }) : t('common.locked') })}
              accessibilityState={{ disabled: !unlocked }}
              style={({ pressed }) => [styles.circle, !unlocked && styles.locked, stars > 0 && styles.completed, pressed && { opacity: 0.7 }]}>
              <Text style={[styles.number, !unlocked && { color: colors.muted }]}>{level.id}</Text>
            </Pressable>
            <Stars count={stars} /><Text style={[ui.small, { textAlign: 'center' }]}>{unlocked ? t(`${level.id}.title`, { ns: 'levels' }) : t('common.locked')}</Text>
            {progress.best[level.id] && <Text style={ui.small}>{t('common.best', { score: progress.best[level.id].score })}</Text>}
          </View>;
        })}
      </View>
    </View>)}
  </Page>;
}
const styles = StyleSheet.create({
  path: { alignItems: 'center', paddingVertical: 8 },
  node: { alignItems: 'center', width: '100%', paddingTop: 20, gap: 5 },
  circle: { height: 66, width: 66, borderRadius: 33, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#C9DCC3' },
  completed: { backgroundColor: '#B87915', borderColor: '#F1D696' },
  locked: { backgroundColor: '#E4E8E0', borderColor: '#D6DCD2' },
  number: { color: '#FFFFFF', fontSize: 23, fontWeight: '800' },
  connector: { height: 18, width: 3, backgroundColor: colors.border, marginBottom: 2 },
});
