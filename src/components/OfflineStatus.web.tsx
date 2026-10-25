import { useSyncExternalStore } from 'react';
import { Text } from 'react-native';
import { ui } from './ui';
declare global { interface Window { __intervalifyOffline?: 'preparing' | 'ready' | 'failed' } }
export default function OfflineStatus() {
  const state = useSyncExternalStore((notify) => {
    window.addEventListener('intervalify-offline', notify);
    return () => window.removeEventListener('intervalify-offline', notify);
  }, () => window.__intervalifyOffline, () => undefined);
  if (!state) return null;
  return <Text accessibilityLiveRegion="polite" style={ui.small}>
    {state === 'ready' ? 'Ready to play offline.' : state === 'preparing' ? 'Preparing offline audio. Keep this tab open until it’s ready.' : 'Offline audio could not be saved. Free browser storage and reload to retry.'}
  </Text>;
}
