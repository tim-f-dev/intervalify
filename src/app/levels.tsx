import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, colors, Page, Stars, ui } from '../components/ui';
import { useGame } from '../game/context';
import { levels } from '../game/levels';
import { CHAPTER_STAR_REQUIREMENT } from '../game/progress';

const chapterNames = ['First steps', 'Find your ear', 'Listen deeper', 'Trust the distance', 'Full spectrum'];
export default function LevelMap() {
  const { progress } = useGame();
  return <Page>
    <Button secondary onPress={() => router.replace('/')}>← Home</Button>
    <Text style={ui.eyebrow}>Your listening journey</Text>
    <Text role="heading" style={ui.title}>One interval at a time.</Text>
    <Text style={ui.body}>Earn one star to open the next level. Collect 20 stars in a chapter to open the next chapter.</Text>
    {progress.chapters.map((chapter, chapterIndex) => <View key={chapter.id} style={ui.card}>
      <Text style={ui.eyebrow}>Chapter {chapter.id} · {chapter.stars} / 60 stars</Text>
      <Text role="heading" style={ui.heading}>{chapterNames[chapterIndex]}</Text>
      {!chapter.unlocked && <Text style={ui.body}>Locked · Earn {CHAPTER_STAR_REQUIREMENT} stars in Chapter {chapter.id - 1} ({progress.chapters[chapterIndex - 1].stars}/{CHAPTER_STAR_REQUIREMENT}).</Text>}
      <View style={styles.path}>
        {levels.slice(chapterIndex * 20, chapterIndex * 20 + 20).map((level, index) => {
          const unlocked = progress.unlockedLevels.includes(level.id);
          const stars = progress.best[level.id]?.stars ?? 0;
          return <View key={level.id} style={[styles.node, { transform: [{ translateX: [0, 28, 46, 28, 0, -28, -46, -28][index % 8] }] }]}>
            {index > 0 && <View style={styles.connector} />}
            <Pressable disabled={!unlocked} onPress={() => router.push(`/play/${level.id}`)}
              accessibilityRole="button" accessibilityLabel={`Level ${level.id}, ${level.title}, ${unlocked ? `${stars} stars` : 'locked'}`}
              accessibilityState={{ disabled: !unlocked }}
              style={({ pressed }) => [styles.circle, !unlocked && styles.locked, stars > 0 && styles.completed, pressed && { opacity: 0.7 }]}>
              <Text style={[styles.number, !unlocked && { color: colors.muted }]}>{level.id}</Text>
            </Pressable>
            <Stars count={stars} /><Text style={ui.small}>{unlocked ? level.title : 'Locked'}</Text>
            {progress.best[level.id] && <Text style={ui.small}>Best: {progress.best[level.id].score}/10</Text>}
          </View>;
        })}
      </View>
    </View>)}
  </Page>;
}
const styles = StyleSheet.create({
  path: { alignItems: 'center', paddingVertical: 8 },
  node: { alignItems: 'center', width: '100%', paddingTop: 20, gap: 5 },
  circle: { height: 66, width: 66, borderRadius: 33, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#C9DCC3' },
  completed: { backgroundColor: '#B87915', borderColor: '#F1D696' },
  locked: { backgroundColor: '#E4E8E0', borderColor: '#D6DCD2' },
  number: { color: '#FFFFFF', fontSize: 23, fontWeight: '800' },
  connector: { height: 18, width: 3, backgroundColor: colors.border, marginBottom: 2 },
});
