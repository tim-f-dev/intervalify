import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../game/context';
import { useTranslation } from 'react-i18next';
import { useScreenLayout } from './useLayout';

export const colors = { ink: '#173E39', muted: '#526D67', canvas: '#F6F8F2', paper: '#FFFFFF',
  green: '#216451', pale: '#E5EEE3', border: '#D5DFD4', gold: '#B87915', amber: '#FFF0CB',
  red: '#A33336', pink: '#FBE8E5' };
export const ui = StyleSheet.create({
  page: { flex: 1, minHeight: 0, overflow: 'hidden', backgroundColor: colors.canvas },
  content: { width: '100%', maxWidth: 820, alignSelf: 'center', padding: 24, paddingBottom: 48, gap: 20 },
  eyebrow: { color: colors.green, fontSize: 12, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  title: { color: colors.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  heading: { color: colors.ink, fontSize: 24, fontWeight: '700' },
  body: { color: colors.muted, fontSize: 16, lineHeight: 25 },
  small: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  card: { borderRadius: 24, padding: 24, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border, gap: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  button: { minHeight: 44, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  secondary: { backgroundColor: colors.pale },
  disabled: { opacity: 0.45 },
  track: { height: 8, borderRadius: 5, backgroundColor: colors.pale, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.green, borderRadius: 5 },
  warning: { padding: 16, backgroundColor: colors.amber, borderRadius: 16, gap: 12 },
});
export function Button({ children, onPress, disabled, secondary, label, large }: {
  children: ReactNode; onPress(): void; disabled?: boolean; secondary?: boolean; label?: string; large?: boolean;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }}
    disabled={disabled} onPress={onPress} style={({ pressed }) => [ui.button, large && { minHeight: 60, paddingVertical: 16 }, secondary && ui.secondary, disabled && ui.disabled, pressed && { opacity: 0.75 }]}>
    <Text style={[ui.buttonText, large && { fontSize: 18 }, secondary && { color: colors.ink }]}>{children}</Text>
  </Pressable>;
}
export function Stars({ count, large = false }: { count: number; large?: boolean }) {
  const { t } = useTranslation();
  return <Text accessibilityLabel={t('common.starRating', { stars: t('common.starCount', { count }), max: 3 })} style={{ color: colors.gold, fontSize: large ? 44 : 17, letterSpacing: 3 }}>
    {'★'.repeat(count)}{'☆'.repeat(3 - count)}
  </Text>;
}
export function Page({ children, header, footer, compact = false }: {
  children: ReactNode; header?: ReactNode; footer?: ReactNode; compact?: boolean;
}) {
  const { t } = useTranslation();
  const { ready, loadError, saveError, saving, retrySave, reload } = useGame();
  const { dense } = useScreenLayout();
  return <SafeAreaView style={ui.page}>
    {ready && header && <View style={{ width: '100%', maxWidth: 820, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 8 }}>{header}</View>}
    <View style={[ui.content, { flex: 1, minHeight: 0, maxWidth: 1200, padding: dense || compact ? 12 : 24, paddingBottom: dense || compact ? 12 : 24, gap: dense || compact ? 8 : 16 }]}>
    {!ready ? <View style={ui.card}>
      <Text style={ui.heading}>{t(loadError ? 'errors.progressTitle' : 'common.opening')}</Text>
      {loadError ? <><Text style={ui.body}>{t(loadError)}</Text><Button onPress={reload}>{t('errors.retryLoad')}</Button></> : <ActivityIndicator color={colors.green} />}
    </View> : <>
      {saveError && <View style={ui.warning}><Text accessibilityLiveRegion="polite" style={ui.body}>{t(saveError)}</Text>
        <Button onPress={retrySave} disabled={saving}>{t('errors.retrySave')}</Button></View>}
      {children}
    </>}
    </View>
    {ready && footer && <View style={{ width: '100%', maxWidth: 1200, alignSelf: 'center', padding: dense ? 8 : 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.canvas }}>{footer}</View>}
  </SafeAreaView>;
}
