import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, colors, Page, ui } from '../components/ui';
import { useGame } from '../game/context';
import { levels } from '../game/levels';
import { chapterOf, STAR_THRESHOLDS } from '../game/progress';
import OfflineStatus from '../components/OfflineStatus';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';


export default function HomeScreen() {
  const { t } = useTranslation();
  const { progress } = useGame();
  const next = progress.unlockedLevels.find((id) => !(progress.best[id]?.stars)) ?? progress.unlockedLevels.at(-1) ?? 1;
  const total = progress.chapters.reduce((sum, chapter) => sum + chapter.stars, 0);
  return <Page>
    <LanguageSelector />
    <View style={[ui.row, { justifyContent: 'space-between' }]}>
      <Text style={ui.eyebrow}>{t('home.eyebrow')}</Text><Text style={ui.small}>{t('home.totalStars', { count: total })}</Text>
    </View>
    <View style={styles.hero}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.notes}>
        <Text style={styles.note}>♪</Text><Text style={styles.note}>♫</Text>
      </View>
      <Text role="heading" style={[ui.title, styles.title]}>Intervalify</Text>
      <Text style={[ui.body, { maxWidth: 430, textAlign: 'center', fontSize: 19 }]}>{t('home.tagline')}</Text>
    </View>
    <View style={ui.card}>
      <Text style={ui.eyebrow}>{t('home.chapter', { id: chapterOf(next) })}</Text>
      <Text style={ui.heading}>{t('common.levelTitle', { id: next, title: t(`${levels[next - 1].id}.title`, { ns: 'levels' }) })}</Text>
      <Text style={ui.body}>{t('home.instructions')}</Text>
      <Button onPress={() => router.push(`/play/${next}`)}>{t('home.play', { id: next })}</Button>
      <Button secondary onPress={() => router.push('/levels')}>{t('home.explore')}</Button>
    </View>
    <View style={ui.row}><Text style={ui.small}>{t('home.questions')}</Text><Text style={ui.small}>{t('home.thresholds', { one: STAR_THRESHOLDS[0], two: STAR_THRESHOLDS[1], three: STAR_THRESHOLDS[2] })}</Text></View>
    <Text style={ui.small}>{t('home.volume')}</Text>
    <Button secondary onPress={() => router.push('/credits')}>{t('home.credits')}</Button>
    <OfflineStatus />
  </Page>;
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 24, gap: 20 },
  title: { fontSize: 52, textAlign: 'center' },
  notes: { width: 180, height: 100, borderRadius: 32, backgroundColor: colors.pale, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  note: { fontSize: 58, color: colors.green },
});
