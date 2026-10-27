import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Page, ui } from '../components/ui';
import LanguageSelector from '../components/LanguageSelector';

export default function Options() {
  const { t } = useTranslation();
  return <Page>
    <Button secondary onPress={() => router.replace('/')}>{t('nav.home')}</Button>
    <Text role="heading" style={ui.title}>{t('options.title')}</Text>
    <View style={ui.card}><LanguageSelector /></View>
    <Button secondary onPress={() => router.push('/credits')}>{t('home.credits')}</Button>
  </Page>;
}
