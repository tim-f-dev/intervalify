import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Page, Stars, ui } from '../components/ui';
import { useGame } from '../game/context';
import { STAR_THRESHOLDS } from '../game/progress';
import { useTranslation } from 'react-i18next';

export default function Results() {
  const { t } = useTranslation();
  const { result, progress, saving, saveError } = useGame();
  if (!result) return <Page><Text style={ui.heading}>{t('results.empty')}</Text><Button onPress={() => router.replace('/levels')}>{t('nav.map')}</Button></Page>;
  const { levelId, score, stars, previous, unlockedChapter } = result;
  const next = levelId + 1;
  const nextAvailable = progress.unlockedLevels.includes(next);
  return <Page>
    <Text style={ui.eyebrow}>{t('common.levelTitle', { id: levelId, title: t(`${levelId}.title`, { ns: 'levels' }) })}</Text>
    <View style={[ui.card, { alignItems: 'center', paddingVertical: 40 }]}>
      <Text role="heading" style={[ui.title, { textAlign: 'center' }]}>{t(stars === 3 ? 'results.perfect' : stars ? 'results.good' : 'results.practice')}</Text>
      <Stars count={stars} large /><Text style={ui.heading}>{t('results.score', { score })}</Text>
      <Text style={ui.body}>{t(stars === 0 ? 'results.needStar' : 'results.bestKept', { required: STAR_THRESHOLDS[0] })}</Text>
      <Text style={ui.small}>{t('results.previous', { score: previous.score, stars: t('common.starCount', { count: previous.stars }) })}</Text>
      <Text style={ui.small}>{t('results.best', { score: progress.best[levelId]?.score, stars: t('common.starCount', { count: progress.best[levelId]?.stars ?? 0 }) })}</Text>
      <Text accessibilityLiveRegion="polite" style={ui.small}>{t(saving ? 'results.saving' : saveError ? 'results.notSaved' : 'results.saved')}</Text>
    </View>
    {unlockedChapter && <View style={ui.warning}><Text style={ui.heading}>{t('results.unlocked', { id: unlockedChapter })}</Text><Text style={ui.body}>{t('results.unlockMessage')}</Text></View>}
    {nextAvailable && <Button onPress={() => router.replace(`/play/${next}`)}>{t('home.play', { id: next })}</Button>}
    {levelId === 100 && stars > 0 && <Text style={ui.heading}>{t('results.finish')}</Text>}
    <Button secondary onPress={() => router.replace(`/play/${levelId}`)}>{t('results.retry', { id: levelId })}</Button>
    <Button secondary onPress={() => router.replace('/levels')}>{t('results.map')}</Button>
  </Page>;
}
