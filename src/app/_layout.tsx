import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../game/context';

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
