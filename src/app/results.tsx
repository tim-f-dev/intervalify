import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Page, Stars, ui } from '../components/ui';
import { useScreenLayout } from '../components/useLayout';
import { useGame } from '../game/context';
import { chapterOf, STAR_THRESHOLDS } from '../game/progress';
import { useTranslation } from 'react-i18next';

export default function Results() {
  const { t } = useTranslation();
  const { dense, landscape } = useScreenLayout();
  const { result, progress, saving, saveError } = useGame();
  if (!result) return <Page><Text style={ui.heading}>{t('results.empty')}</Text><Button onPress={() => router.replace('/levels')}>{t('nav.map')}</Button></Page>;
  const { levelId, score, stars, previous, unlockedChapter } = result;
  const next = levelId + 1;
  const nextAvailable = progress.unlockedLevels.includes(next);
  return <Page compact>
    <Text style={ui.eyebrow}>{t('common.levelTitle', { id: levelId, title: t(`${levelId}.title`, { ns: 'levels' }) })}</Text>
    <View style={{ flex: 1, minHeight: 0, gap: 12, flexDirection: landscape ? 'row' : 'column', justifyContent: 'center' }}>
      <View style={[ui.card, { flex: 1, minHeight: 0, alignItems: 'center', justifyContent: 'center', padding: dense ? 12 : 24, gap: dense ? 6 : 12 }]}>
        <Text role="heading" style={[ui.title, { fontSize: dense ? 24 : 36, textAlign: 'center' }]}>{t(stars === 3 ? 'results.perfect' : stars ? 'results.good' : 'results.practice')}</Text>
        <Stars count={stars} large={!dense} /><Text style={ui.heading}>{t('results.score', { score })}</Text>
        <Text style={[ui.body, dense && { fontSize: 14, lineHeight: 20 }]}>{t(stars === 0 ? 'results.needStar' : 'results.bestKept', { required: STAR_THRESHOLDS[0] })}</Text>
        <Text style={ui.small}>{t('results.previous', { score: previous.score, stars: t('common.starCount', { count: previous.stars }) })}</Text>
        <Text style={ui.small}>{t('results.best', { score: progress.best[levelId]?.score, stars: t('common.starCount', { count: progress.best[levelId]?.stars ?? 0 }) })}</Text>
        <Text accessibilityLiveRegion="polite" style={ui.small}>{t(saving ? 'results.saving' : saveError ? 'results.notSaved' : 'results.saved')}</Text>
      </View>
      <View style={{ width: landscape ? '40%' : undefined, gap: 8, justifyContent: 'center' }}>
        {unlockedChapter && <Text style={ui.heading}>{t('results.unlocked', { id: unlockedChapter })}</Text>}
        {levelId === 100 && stars > 0 && <Text style={ui.small}>{t('results.finish')}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {nextAvailable && <View style={{ flexGrow: 1, flexBasis: landscape ? '100%' : '45%' }}><Button onPress={() => router.replace(`/play/${next}`)}>{t('home.play', { id: next })}</Button></View>}
          <View style={{ flexGrow: 1, flexBasis: landscape ? '100%' : '45%' }}><Button secondary onPress={() => router.replace(`/play/${levelId}`)}>{t('results.retry', { id: levelId })}</Button></View>
          <View style={{ flexGrow: 1, flexBasis: landscape ? '100%' : '45%' }}><Button secondary onPress={() => router.replace(`/packs/${chapterOf(levelId)}`)}>{t('packs.backToPack')}</Button></View>
          <View style={{ flexGrow: 1, flexBasis: landscape ? '100%' : '45%' }}><Button secondary onPress={() => router.replace('/levels')}>{t('packs.back')}</Button></View>
        </View>
      </View>
    </View>
  </Page>;
}
