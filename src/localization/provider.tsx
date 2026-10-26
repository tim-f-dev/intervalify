import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { createLocalization, LanguageController } from './core';
import DocumentLanguage from './DocumentLanguage';

export const localization = createLocalization();
export const languageController = new LanguageController(localization, AsyncStorage, () => {
  try { return getLocales()[0]?.languageTag; } catch { return 'en'; }
});
export function useLanguage() {
  return useSyncExternalStore(languageController.subscribe, languageController.getSnapshot, languageController.getSnapshot);
}
export function LocalizationProvider({ children }: { children: ReactNode }) {
  const { ready } = useLanguage();
  useEffect(() => { void languageController.initialize(); }, []);
  return <I18nextProvider i18n={localization}><DocumentLanguage />{ready ? children : <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /></View>}</I18nextProvider>;
}
