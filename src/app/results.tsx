import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Page, Stars, ui } from '../components/ui';
import { useGame } from '../game/context';
import { getLevel } from '../game/levels';

export default function Results() {
  const { result, progress, saving, saveError } = useGame();
  if (!result) return <Page><Text style={ui.heading}>Choose a level to begin.</Text><Button onPress={() => router.replace('/levels')}>Level map</Button></Page>;
  const { levelId, score, stars, previous, unlockedChapter } = result;
  const next = levelId + 1;
  const nextAvailable = progress.unlockedLevels.includes(next);
  return <Page>
    <Text style={ui.eyebrow}>Level {levelId} · {getLevel(levelId)?.title}</Text>
    <View style={[ui.card, { alignItems: 'center', paddingVertical: 40 }]}>
      <Text role="heading" style={ui.title}>{stars === 3 ? 'Perfect listening.' : stars ? 'Nicely heard.' : 'Every listen helps.'}</Text>
      <Stars count={stars} large /><Text style={ui.heading}>{score} / 10 correct</Text>
      <Text style={ui.body}>{stars === 0 ? 'Reach 5 correct answers to earn a star and open the next level.' : 'Your highest score and stars are kept when you replay.'}</Text>
      <Text style={ui.small}>Previous best: {previous.score}/10 · {previous.stars} stars</Text>
      <Text style={ui.small}>Best now: {progress.best[levelId]?.score}/10 · {progress.best[levelId]?.stars} stars</Text>
      <Text accessibilityLiveRegion="polite" style={ui.small}>{saving ? 'Saving progress…' : saveError ? 'Progress has not been saved yet.' : 'Progress stored locally on this device.'}</Text>
    </View>
    {unlockedChapter && <View style={ui.warning}><Text style={ui.heading}>Chapter {unlockedChapter} unlocked!</Text><Text style={ui.body}>Your stars have opened another part of the journey.</Text></View>}
    {nextAvailable && <Button onPress={() => router.replace(`/play/${next}`)}>Play level {next} →</Button>}
    {levelId === 100 && stars > 0 && <Text style={ui.heading}>You reached the end of all 100 levels. Revisit the map to improve your stars.</Text>}
    <Button secondary onPress={() => router.replace(`/play/${levelId}`)}>Retry level {levelId}</Button>
    <Button secondary onPress={() => router.replace('/levels')}>Back to the level map</Button>
  </Page>;
}
