import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, colors, Page, ui } from '../components/ui';
import { useGame } from '../game/context';
import { levels } from '../game/levels';
import { chapterOf } from '../game/progress';
import OfflineStatus from '../components/OfflineStatus';

export default function HomeScreen() {
  const { progress } = useGame();
  const next = progress.unlockedLevels.find((id) => !(progress.best[id]?.stars)) ?? progress.unlockedLevels.at(-1) ?? 1;
  const total = progress.chapters.reduce((sum, chapter) => sum + chapter.stars, 0);
  return <Page>
    <View style={[ui.row, { justifyContent: 'space-between' }]}>
      <Text style={ui.eyebrow}>An ear for the everyday</Text><Text style={ui.small}>{total} / 300 stars</Text>
    </View>
    <View style={styles.hero}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.notes}>
        <Text style={styles.note}>♪</Text><Text style={styles.note}>♫</Text>
      </View>
      <Text role="heading" style={[ui.title, styles.title]}>Intervalify</Text>
      <Text style={[ui.body, { maxWidth: 430, textAlign: 'center', fontSize: 19 }]}>Two notes. A little attention.{'\n'}A whole new way to listen.</Text>
    </View>
    <View style={ui.card}>
      <Text style={ui.eyebrow}>Chapter {chapterOf(next)} of 5</Text>
      <Text style={ui.heading}>Level {next} · {levels[next - 1].title}</Text>
      <Text style={ui.body}>Listen to two notes, then choose their interval. Replay as often as you like—there is no timer.</Text>
      <Button onPress={() => router.push(`/play/${next}`)}>Play level {next} →</Button>
      <Button secondary onPress={() => router.push('/levels')}>Explore all 100 levels</Button>
    </View>
    <View style={ui.row}><Text style={ui.small}>10 questions per level</Text><Text style={ui.small}>★ 5 correct · ★★ 8 · ★★★ 10</Text></View>
    <Text style={ui.small}>Use a comfortable volume. Headphones can help you hear close intervals.</Text>
    <Button secondary onPress={() => router.push('/credits')}>Sounds & credits</Button>
    <OfflineStatus />
  </Page>;
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 24, gap: 20 },
  title: { fontSize: 52, textAlign: 'center' },
  notes: { width: 180, height: 100, borderRadius: 32, backgroundColor: colors.pale, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  note: { fontSize: 58, color: colors.green },
});
