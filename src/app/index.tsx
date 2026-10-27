import { Link, router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, colors, Page, ui } from '../components/ui';
import { useScreenLayout } from '../components/useLayout';
import { useGame } from '../game/context';
import { totalStars } from '../game/progress';
import OfflineStatus from '../components/OfflineStatus';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { progress } = useGame();
  const { dense, landscape } = useScreenLayout();
  return <Page compact>
    <View style={[ui.row, { justifyContent: 'space-between', flexShrink: 0 }]}>
      <Text style={[ui.eyebrow, { letterSpacing: 1, fontSize: 10 }]}>{t('home.eyebrow')}</Text>
      <Text style={ui.small}>{t('home.totalStars', { count: totalStars(progress.best) })}</Text>
    </View>
    <View style={{ flex: 1, minHeight: 0, flexDirection: landscape ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: dense ? 12 : 24 }}>
      <View style={{ flex: 1, minHeight: 0, width: '100%', alignItems: 'center', justifyContent: 'center', gap: dense ? 8 : 16 }}>
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: dense ? 120 : 180, height: dense ? 56 : 90, borderRadius: 24, backgroundColor: colors.pale, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Text style={{ fontSize: dense ? 38 : 52, color: colors.green }}>♪</Text><Text style={{ fontSize: dense ? 38 : 52, color: colors.green }}>♫</Text>
        </View>
        <Text role="heading" style={[ui.title, { fontSize: dense ? 38 : 52, textAlign: 'center' }]}>Intervalify</Text>
        <Text style={[ui.body, { maxWidth: 430, textAlign: 'center', fontSize: dense ? 14 : 18, lineHeight: dense ? 20 : 26 }]}>{t('home.tagline')}</Text>
      </View>
      <View style={{ flex: landscape ? 1 : undefined, width: landscape ? undefined : '100%', maxWidth: 480, gap: dense ? 8 : 16 }}>
        <View style={[ui.card, { padding: dense ? 12 : 20, gap: 12 }]}>
          <Button onPress={() => router.push('/levels')}><Text style={{ fontSize: 26 }}>{t('home.playMenu')}</Text></Button>
        </View>
        <View style={{ alignSelf: 'center', minWidth: 160 }}><Button secondary onPress={() => router.push('/options')}>{t('options.title')}</Button></View>
      </View>
    </View>
    <OfflineStatus />
    <View style={[ui.row, { justifyContent: 'center', flexShrink: 0 }]}>
      <Link href="/privacy" style={[ui.small, { padding: 10 }]}>{t('privacy.title')}</Link>
      <Link href="/legal" style={[ui.small, { padding: 10 }]}>{t('legal.title')}</Link>
    </View>
  </Page>;
}
