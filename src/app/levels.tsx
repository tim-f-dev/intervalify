import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, colors, Page, ui } from '../components/ui';
import { useAvailableArea } from '../components/useLayout';
import { useGame } from '../game/context';
import { PACK_STAR_REQUIREMENTS, totalStars } from '../game/progress';

export default function LevelPacks() {
  const { t } = useTranslation();
  const { progress } = useGame();
  const { area, onLayout } = useAvailableArea();
  const total = totalStars(progress.best);
  const side = Math.max(80, Math.min(340, area.width * 0.82, area.height - 40));
  return <Page compact>
    <View style={[ui.row, { justifyContent: 'space-between' }]}>
      <Button secondary onPress={() => router.replace('/')}>{t('nav.home')}</Button>
      <Text style={ui.small}>{t('home.totalStars', { count: total })}</Text>
    </View>
    <Text role="heading" style={[ui.title, { fontSize: 30 }]}>{t('packs.title')}</Text>
    <View onLayout={onLayout} style={{ flex: 1, minHeight: 0, borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.pale, overflow: 'hidden' }}>
      <ScrollView nativeID="packs-scroll" horizontal showsHorizontalScrollIndicator showsVerticalScrollIndicator={false} bounces={false}
        style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', gap: 16, padding: 16 }}>
        {progress.chapters.map((pack, index) => {
          const required = PACK_STAR_REQUIREMENTS[index];
          const status = pack.unlocked ? t('packs.stars', { count: pack.stars }) : t('packs.locked', { required, earned: total });
          return <Pressable key={pack.id} disabled={!pack.unlocked} accessibilityRole="button"
            accessibilityLabel={t('packs.label', { id: pack.id, status })} accessibilityState={{ disabled: !pack.unlocked }}
            onPress={() => router.push(`/packs/${pack.id}`)}
            style={({ pressed }) => [{ width: side, height: side, padding: 12, gap: 6, borderRadius: 24, borderWidth: 2, borderColor: pack.unlocked ? colors.green : colors.border, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.7 }]}>
            <Text accessible={false} style={{ color: pack.unlocked ? colors.green : colors.muted, fontSize: Math.min(68, side * 0.22), fontWeight: '800' }}>{pack.id}</Text>
            <Text style={{ color: colors.ink, fontSize: Math.min(24, Math.max(14, side * 0.075)), fontWeight: '700', textAlign: 'center' }}>{t('packs.pack', { id: pack.id })}</Text>
            {side >= 180 && <Text style={ui.small}>{t('packs.range', { first: index * 20 + 1, last: index * 20 + 20 })}</Text>}
            <Text style={{ color: pack.unlocked ? colors.gold : colors.muted, fontSize: Math.min(25, Math.max(15, side * 0.085)), fontWeight: '700' }}>{t('packs.counter', { earned: pack.unlocked ? pack.stars : total, required: pack.unlocked ? 60 : required })}</Text>
            {!pack.unlocked && <Text accessible={false} style={{ position: 'absolute', top: 10, right: 10, fontSize: 18 }}>🔒</Text>}
          </Pressable>;
        })}
      </ScrollView>
    </View>
  </Page>;
}
