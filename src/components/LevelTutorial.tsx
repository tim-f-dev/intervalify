import { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, colors, ui } from './ui';
import { useScreenLayout } from './useLayout';
import { useTutorial } from '../tutorial/provider';
import TutorialCheckbox from './TutorialCheckbox';

export default function LevelTutorial() {
  const { t } = useTranslation();
  const { dense } = useScreenLayout();
  const { dismiss, saving, saveError } = useTutorial();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const start = () => { void dismiss(dontShowAgain); };
  return <Modal visible transparent animationType="fade" onRequestClose={start} supportedOrientations={['portrait', 'landscape']}>
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <View accessibilityViewIsModal style={[ui.card, { width: '100%', maxWidth: 520, padding: dense ? 16 : 24, gap: dense ? 12 : 16 }]}>
        <Text role="heading" style={[ui.heading, { fontSize: 24 }]}>{t('tutorial.title')}</Text>
        <Text accessibilityLiveRegion="polite" style={[ui.body, dense && { fontSize: 14, lineHeight: 20 }, saveError && { color: colors.red }]}>{t(saveError ? 'tutorial.saveError' : 'home.instructions')}</Text>
        <Text style={[ui.body, dense && { fontSize: 14, lineHeight: 20 }]}>{t('home.volume')}</Text>
        <TutorialCheckbox checked={dontShowAgain} disabled={saving} label={t('tutorial.dontShowAgain')} onChange={setDontShowAgain} />
        <Button disabled={saving} onPress={start}>{t(saving ? 'tutorial.saving' : 'tutorial.start')}</Button>
      </View>
    </View>
  </Modal>;
}
