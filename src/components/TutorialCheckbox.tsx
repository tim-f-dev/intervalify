import { Pressable, Text, View } from 'react-native';
import { colors, ui } from './ui';

export type TutorialCheckboxProps = { checked: boolean; disabled: boolean; label: string; onChange(checked: boolean): void };
export default function TutorialCheckbox({ checked, disabled, label, onChange }: TutorialCheckboxProps) {
  return <Pressable accessibilityRole="checkbox" accessibilityLabel={label} aria-checked={checked} aria-disabled={disabled}
    accessibilityState={{ checked, disabled }} disabled={disabled} onPress={() => onChange(!checked)}
    style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <View style={{ width: 24, height: 24, borderWidth: 2, borderColor: colors.green, borderRadius: 5, backgroundColor: checked ? colors.green : colors.paper, alignItems: 'center', justifyContent: 'center' }}>
      {checked && <Text accessible={false} style={{ color: '#FFFFFF', fontWeight: '800' }}>✓</Text>}
    </View>
    <Text style={[ui.body, { flex: 1 }]}>{label}</Text>
  </Pressable>;
}
