import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../game/context';
import { LocalizationProvider } from '../localization/provider';

export default function RootLayout() {
  return (
    <LocalizationProvider><GameProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider></LocalizationProvider>
  );
}
