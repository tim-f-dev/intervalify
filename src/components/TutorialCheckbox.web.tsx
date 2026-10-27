import type { TutorialCheckboxProps } from './TutorialCheckbox';
import { colors } from './ui';

export default function TutorialCheckbox({ checked, disabled, label, onChange }: TutorialCheckboxProps) {
  return <label style={{ minHeight: 44, display: 'flex', alignItems: 'center', gap: 12, cursor: disabled ? 'default' : 'pointer' }}>
    <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)}
      style={{ width: 24, height: 24, margin: 0, flexShrink: 0, accentColor: colors.green }} />
    <span style={{ color: colors.muted, fontFamily: 'system-ui, sans-serif', fontSize: 16, lineHeight: '25px' }}>{label}</span>
  </label>;
}
