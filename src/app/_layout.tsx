import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../game/context';
import { LocalizationProvider } from '../localization/provider';
import ScrollStyles from '../components/ScrollStyles';
import { TutorialProvider } from '../tutorial/provider';

export default function RootLayout() {
  return (
    <LocalizationProvider><TutorialProvider><GameProvider>
      <ScrollStyles />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider></TutorialProvider></LocalizationProvider>
  );
}
