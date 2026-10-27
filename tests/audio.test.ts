import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IntervalPlayer, type IntervalSound, type Voice } from '../src/audio/player';

function harness() {
  const starts: number[] = []; const disposed: number[] = [];
  const player = new IntervalPlayer({
    initialize: async () => {},
    create(_program, midi): Voice {
      return { ready: async () => {}, play: () => { starts.push(midi); },
        fadeOut: async () => {}, dispose: () => { disposed.push(midi); }, error: () => null };
    },
  });
  return { player, starts, disposed };
}
const sound: IntervalSound = { program: 0, notes: [60, 67], playback: 'ascending', speed: 'fast', noteDurationMs: 180 };

test('replay preserves notes and direction; no gameplay answer is exposed', async () => {
  const { player, starts } = harness();
  await player.play(sound); await player.replay();
  assert.deepEqual(starts, [60, 67, 60, 67]);
  assert.deepEqual(sound.notes, [60, 67]);
});
test('stop cancels a pending second note and disposes all voices', async () => {
  const { player, starts, disposed } = harness();
  const pending = player.play(sound);
  await new Promise((r) => setTimeout(r, 30)); player.stop(); await pending;
  assert.deepEqual(starts, [60]); assert.deepEqual(disposed, [60, 67]);
});
test('a new question cancels the old question without disposing new voices', async () => {
  const { player, starts } = harness();
  const old = player.play(sound);
  await new Promise((r) => setTimeout(r, 30));
  await player.play({ ...sound, notes: [72, 76], playback: 'harmonic' }); await old;
  assert.deepEqual(starts, [60, 72, 76]);
});
test('harmonic playback starts both ready voices in the same event-loop turn', async () => {
  const events: string[] = [];
  const player = new IntervalPlayer({ initialize: async () => {}, create(_p, midi) {
    return { ready: async () => { events.push(`ready ${midi}`); }, play: () => { events.push(`play ${midi}`); },
      fadeOut: async () => {}, dispose: () => {}, error: () => null };
  } });
  await player.play({ ...sound, playback: 'harmonic' });
  assert.deepEqual(events, ['ready 60', 'ready 67', 'play 60', 'play 67']);
});

test('a delayed browser play start does not consume the audible note duration', async () => {
  let started!: () => void;
  const audible = new Promise<void>((resolve) => { started = resolve; });
  let fades = 0;
  let disposed = 0;
  const player = new IntervalPlayer({ initialize: async () => {}, create() {
    return { ready: async () => {}, play: () => audible, fadeOut: async () => { fades++; },
      dispose: () => { disposed++; }, error: () => null };
  } });
  const pending = player.playNote(0, 60, 180);
  try {
    await new Promise((resolve) => setTimeout(resolve, 220));
    assert.equal(fades, 0);
    assert.equal(disposed, 0);
    started(); await pending;
    assert.equal(fades, 1);
  } finally { started(); player.stop(); await pending; }
});
