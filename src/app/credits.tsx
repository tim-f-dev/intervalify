import { router } from 'expo-router';
import { Text } from 'react-native';
import { Button, Page, ui } from '../components/ui';
import notices from '../audio/licenses.json';

export default function Credits() {
  return <Page>
    <Button secondary onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>← Back</Button>
    <Text role="heading" style={ui.title}>Sounds & credits</Text>
    <Text style={ui.body}>128 General MIDI programs, rendered from the officially distributed MS Basic SoundFont with FluidSynth. Instrument samples are bundled for offline playback. Some GM programs are sound effects, so interval lessons use pitched instruments only.</Text>
    <Text selectable style={ui.small}>{notices.msBasic}</Text>
  </Page>;
}
