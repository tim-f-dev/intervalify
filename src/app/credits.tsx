import { router } from 'expo-router';
import { Text } from 'react-native';
import { Button, Page, ui } from '../components/ui';
import notices from '../audio/licenses.json';
import { useTranslation } from 'react-i18next';

export default function Credits() {
  const { t } = useTranslation();
  return <Page>
    <Button secondary onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>{t('nav.back')}</Button>
    <Text role="heading" style={ui.title}>{t('home.credits')}</Text>
    <Text style={ui.body}>{t('credits.description')}</Text>
    <Text style={ui.small}>{t('credits.originalNotice')}</Text>
    <Text selectable style={ui.small}>{notices.msBasic}</Text>
  </Page>;
}
