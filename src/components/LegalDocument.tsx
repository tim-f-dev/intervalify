import { Link, router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Page, colors, ui } from './ui';
import { operator } from '../legal/operator';

export default function LegalDocument({ kind }: { kind: 'privacy' | 'legal' }) {
  const { t } = useTranslation();
  const sections = kind === 'privacy' ? ['overview', 'storage', 'hosting', 'contact', 'rights'] : ['operator', 'contact', 'content'];
  return <Page compact>
    <Button secondary onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>{t('nav.back')}</Button>
    <Text role="heading" style={ui.title}>{t(`${kind}.title`)}</Text>
    <Text style={ui.small}>{t('legalPages.updated')}</Text>
    <View style={{ flex: 1, minHeight: 0, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper, overflow: 'hidden' }}>
    <ScrollView nativeID={`${kind}-scroll`} showsVerticalScrollIndicator showsHorizontalScrollIndicator={false} bounces={false}
      style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }}>
    <View style={ui.card}>
      <Text role="heading" style={ui.heading}>{t('legalPages.responsible')}</Text>
      <Text selectable style={ui.body}>{operator.name}{'\n'}{operator.address}{'\n'}{t('legalPages.country')}</Text>
      <Link href={`mailto:${operator.email}`} style={{ color: colors.green, fontSize: 16 }}>{operator.email}</Link>
    </View>
    {sections.map((section) => <View key={section} style={{ gap: 8 }}>
      <Text role="heading" style={ui.heading}>{t(`${kind}.${section}.title`)}</Text>
      <Text selectable style={ui.body}>{t(`${kind}.${section}.body`)}</Text>
      {section === 'hosting' && <Link href="https://www.cloudflare.com/privacypolicy/" style={{ color: colors.green, fontSize: 16 }}>{t('privacy.hosting.link')}</Link>}
    </View>)}
    </ScrollView>
    </View>
    <Link href={kind === 'privacy' ? '/legal' : '/privacy'} style={{ color: colors.green, fontSize: 16 }}>{t(kind === 'privacy' ? 'legal.title' : 'privacy.title')}</Link>
  </Page>;
}
