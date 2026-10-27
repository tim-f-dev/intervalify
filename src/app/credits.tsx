import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { Button, Page, ui } from '../components/ui';
import { useAvailableArea, useScreenLayout } from '../components/useLayout';
import { paginateNotice } from '../layout/geometry';
import notices from '../audio/licenses.json';
import { useTranslation } from 'react-i18next';

export default function Credits() {
  const { t } = useTranslation();
  const { area, onLayout } = useAvailableArea();
  const { height, fontScale } = useScreenLayout();
  const [index, setIndex] = useState(0);
  const pages = paginateNotice(notices.msBasic, Math.floor(area.width / (8 * fontScale)), Math.floor(area.height / (18 * fontScale)));
  const page = Math.min(index, pages.length - 1);
  return <Page compact>
    <Button secondary onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>{t('nav.back')}</Button>
    <Text role="heading" style={[ui.title, { fontSize: height < 500 ? 24 : 30 }]}>{t('home.credits')}</Text>
    {height >= 650 && <Text style={ui.body}>{t('credits.description')}</Text>}
    <Text style={ui.small}>{t('credits.originalNotice')}</Text>
    <View style={[ui.card, { flex: 1, minHeight: 0, padding: 12 }]}>
      <View onLayout={onLayout} style={{ flex: 1, minHeight: 0 }}>
        {area.width > 0 && area.height > 0 && <Text selectable style={[ui.small, { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 12, lineHeight: 18 }]}>{pages[page]}</Text>}
      </View>
    </View>
    <Text accessibilityLiveRegion="polite" style={[ui.small, { textAlign: 'center' }]}>{t('credits.page', { current: page + 1, total: pages.length })}</Text>
    <View style={[ui.row, { flexWrap: 'nowrap' }]}>
      <View style={{ flex: 1 }}><Button secondary disabled={page === 0} onPress={() => setIndex(page - 1)}>{t('credits.previous')}</Button></View>
      <View style={{ flex: 1 }}><Button secondary disabled={page === pages.length - 1} onPress={() => setIndex(page + 1)}>{t('credits.next')}</Button></View>
    </View>
  </Page>;
}
