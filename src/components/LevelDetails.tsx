import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { LevelConfig } from '../game/types';
import { useGame } from '../game/context';
import { localizedInterval } from '../localization/core';
import { Button, colors, Stars, ui } from './ui';
import { useScreenLayout } from './useLayout';

export default function LevelDetails({ levelId, packLevels, onSelect, onClose }: {
  levelId: number; packLevels: readonly LevelConfig[]; onSelect(id: number): void; onClose(): void;
}) {
  const { t } = useTranslation();
  const { progress } = useGame();
  const { width, height } = useScreenLayout();
  const [page, setPage] = useState(0);
  const index = packLevels.findIndex((item) => item.id === levelId);
  const level = packLevels[index];
  const compact = width < 600 || height < 700 || (height < 900 && (level.intervals.length > 6 || level.instruments.length > 4));
  const unlocked = progress.unlockedLevels.includes(levelId);
  const best = progress.best[levelId];
  const instruments = level.instruments.map((program) => t(String(program), { ns: 'instruments' }));
  const intervals = [...level.intervals].sort((a, b) => a - b).map((value) => localizedInterval(t, value));
  const facts: { title: string; text: string }[] = [];
  for (const [title, values] of [['instruments', instruments], ['intervals', intervals]] as const) {
    const size = compact ? (height < 450 ? 3 : 6) : values.length;
    for (let i = 0; i < values.length; i += size) facts.push({ title: t(`levelDetails.${title}`), text: values.slice(i, i + size).join(' · ') });
  }
  facts.push({ title: t('levelDetails.specialties'), text: t(`${level.id}.description`, { ns: 'levels' }) });
  facts.push({ title: t('levelDetails.rules'), text: [t(level.playback === 'mixed' ? 'levelDetails.mixed' : `exercise.${level.playback}`), t(`levelDetails.${level.speed}`), t('levelDetails.format', { questions: level.questionCount, choices: level.choices, duration: level.noteDurationMs })].join(' · ') });
  const visibleFacts = compact ? [facts[Math.min(page, facts.length - 1)]] : facts;
  function select(offset: number) { setPage(0); onSelect(packLevels[index + offset].id); }
  return <Modal visible transparent animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait', 'landscape']}>
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
      <View accessibilityViewIsModal style={[ui.card, { width: '100%', maxWidth: 760, maxHeight: '100%', padding: compact ? 12 : 24, gap: compact ? 8 : 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text role="heading" style={[ui.heading, { flex: 1, fontSize: compact ? 20 : 28 }]}>{t('common.levelTitle', { id: level.id, title: t(`${level.id}.title`, { ns: 'levels' }) })}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={t('levelDetails.close')} onPress={onClose} style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}><Text accessible={false} style={{ color: '#FFFFFF', fontSize: 24 }}>×</Text></Pressable>
        </View>
        <View style={{ flexDirection: height < 500 ? 'row' : 'column', gap: compact ? 8 : 16 }}>
        <View style={{ flex: height < 500 ? 1 : undefined, gap: 8 }}>
        <View accessibilityLiveRegion="polite" style={{ gap: compact ? 6 : 12 }}>
          {visibleFacts.map((fact) => <View key={fact.title + fact.text} style={{ padding: compact ? 10 : 14, borderRadius: 16, backgroundColor: colors.pale, gap: 4 }}>
            <Text style={{ color: colors.green, fontSize: 14, fontWeight: '700' }}>{fact.title}</Text>
            <Text style={[ui.body, compact && { fontSize: 14, lineHeight: 20 }]}>{fact.text}</Text>
          </View>)}
        </View>
        {compact && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <Button secondary label={t('levelDetails.previousFacts')} disabled={page === 0} onPress={() => setPage((n) => n - 1)}>‹</Button>
          <Text style={ui.small}>{t('levelDetails.facts', { current: page + 1, total: facts.length })}</Text>
          <Button secondary label={t('levelDetails.nextFacts')} disabled={page === facts.length - 1} onPress={() => setPage((n) => n + 1)}>›</Button>
        </View>}
        </View>
        <View style={{ flex: height < 500 ? 1 : undefined, justifyContent: 'center', gap: 8 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <Text style={ui.small}>{best ? t('levelDetails.best', { score: best.score, total: level.questionCount }) : t('levelDetails.unplayed')}</Text>
          <Stars count={best?.stars ?? 0} />
        </View>
        {!unlocked && <Text style={[ui.small, { color: colors.red }]}>{t('levelDetails.locked')}</Text>}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Button secondary label={t('levelDetails.previous')} disabled={index === 0} onPress={() => select(-1)}>←</Button>
          <View style={{ flex: 1 }}><Button large disabled={!unlocked} onPress={() => { onClose(); router.push(`/play/${level.id}`); }}>{t('levelDetails.start')}</Button></View>
          <Button secondary label={t('levelDetails.next')} disabled={index === packLevels.length - 1} onPress={() => select(1)}>→</Button>
        </View>
        </View>
        </View>
      </View>
    </View>
  </Modal>;
}
