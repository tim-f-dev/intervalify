import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWebVoice } from '../src/audio/webVoice';
import { IntervalPlayer } from '../src/audio/player';

class FakeMedia extends EventTarget {
  readyState = 0;
  seeking = false;
  volume = 1;
  preload: HTMLAudioElement['preload'] = '';
  error: MediaError | null = null;
  starts: number[] = [];
  pauses = 0;
  removed = false;
  private position = 0;
  get currentTime() { return this.position; }
  set currentTime(value: number) { this.position = value; this.seeking = true; }
  async play() { this.starts.push(this.currentTime); }
  pause() { this.pauses++; }
  load() {}
  removeAttribute(name: string) { if (name === 'src') this.removed = true; }
  emit(name: string) { this.dispatchEvent(new Event(name)); }
  metadata() { this.readyState = 1; this.emit('loadedmetadata'); }
  seeked() { this.seeking = false; this.emit('seeked'); }
  buffered() { this.readyState = 3; this.emit('canplay'); }
}
const tick = () => new Promise<void>((resolve) => setImmediate(resolve));

test('cold bank waits for metadata, actual seek completion and buffered audio', async () => {
  const media = new FakeMedia();
  const voice = createWebVoice(media, 38.4);
  let ready = false;
  const pending = voice.ready().then(() => { ready = true; });
  try {
    await assert.rejects(async () => { await voice.play(); }, /not prepared/);
    assert.equal(media.currentTime, 0);
    media.metadata(); await tick();
    assert.equal(media.currentTime, 38.4); // Exposes the requested time before seeking has finished.
    media.buffered(); await tick();
    assert.equal(ready, false);
    media.seeked(); await pending;
    await voice.play();
    assert.deepEqual(media.starts, [38.4]);
  } finally { voice.dispose(); }
});

test('seek completion alone does not start an unbuffered cold note', async () => {
  const media = new FakeMedia(); media.metadata();
  const voice = createWebVoice(media, 16);
  let ready = false;
  const pending = voice.ready().then(() => { ready = true; });
  try {
    await tick(); media.seeked(); await tick();
    assert.equal(ready, false);
    media.buffered(); await pending; await voice.play();
    assert.deepEqual(media.starts, [16]);
  } finally { voice.dispose(); }
});

test('cached zero-offset notes need no seek event', async () => {
  const media = new FakeMedia(); media.buffered();
  const voice = createWebVoice(media, 0);
  try { await voice.ready(); await voice.play(); assert.deepEqual(media.starts, [0]); }
  finally { voice.dispose(); }
});

test('cancelling while a cold bank seeks releases it without playing', async () => {
  const media = new FakeMedia(); media.metadata();
  const voice = createWebVoice(media, 32);
  const pending = voice.ready();
  const rejected = assert.rejects(pending, /cancelled/);
  await tick(); voice.dispose(); await rejected;
  media.buffered(); media.seeked(); await voice.play();
  assert.deepEqual(media.starts, []);
  assert.equal(media.removed, true);
});

test('bank errors and timeouts fail rather than play the wrong slot', async () => {
  const broken = new FakeMedia();
  const voice = createWebVoice(broken, 16);
  const pending = assert.rejects(voice.ready(), /could not load/);
  broken.emit('error'); await pending; voice.dispose();
  const stalled = new FakeMedia(); stalled.metadata();
  const timeout = createWebVoice(stalled, 16, 15);
  try { await assert.rejects(timeout.ready(), /could not prepare/); assert.deepEqual(stalled.starts, []); }
  finally { timeout.dispose(); }
});

test('first question waits for both bank seeks before playing either note', async () => {
  const media = [new FakeMedia(), new FakeMedia()];
  let index = 0;
  const player = new IntervalPlayer({ initialize: async () => {}, create(_program, midi) {
    return createWebVoice(media[index++], midi === 60 ? 20 : 40);
  } });
  const pending = player.play({ program: 0, notes: [60, 72], playback: 'ascending', speed: 'fast', noteDurationMs: 180 });
  try {
    await tick(); media.forEach((m) => m.metadata()); await tick();
    media[0].buffered(); media[0].seeked(); await tick();
    assert.deepEqual(media.map((m) => m.starts), [[], []]);
    media[1].buffered(); media[1].seeked(); await tick();
    assert.deepEqual(media[0].starts, [20]);
    await pending;
    assert.deepEqual(media[1].starts, [40]);
  } finally { player.stop(); await pending; }
});
