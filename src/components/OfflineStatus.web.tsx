import { useSyncExternalStore } from 'react';
import { Text } from 'react-native';
import { ui } from './ui';
import { useTranslation } from 'react-i18next';
declare global { interface Window { __intervalifyOffline?: 'preparing' | 'ready' | 'failed' } }
export default function OfflineStatus() {
  const { t } = useTranslation();
  const state = useSyncExternalStore((notify) => {
    window.addEventListener('intervalify-offline', notify);
    return () => window.removeEventListener('intervalify-offline', notify);
  }, () => window.__intervalifyOffline, () => undefined);
  if (!state) return null;
  return <Text accessibilityLiveRegion="polite" style={ui.small}>
    {t(`offline.${state}`)}
  </Text>;
}
