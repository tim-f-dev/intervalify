import type { Voice } from './player';

type Media = Pick<HTMLAudioElement, 'readyState' | 'seeking' | 'currentTime' | 'volume' | 'preload' | 'error' |
  'play' | 'pause' | 'load' | 'removeAttribute' | 'addEventListener' | 'removeEventListener'>;

/** Bank offsets must not become audible until the browser has completed the seek. */
export function createWebVoice(media: Media, offset: number, timeoutMs = 12000): Voice {
  let disposed = false;
  let prepared = false;
  let failure: string | null = null;
  const abort = new AbortController();
  media.volume = 0.45;
  media.preload = 'auto';
  const onError = () => { failure = media.error?.message || 'Audio could not load.'; };
  media.addEventListener('error', onError);

  function wait(events: string[], condition: () => boolean, deadline: number, start?: () => void) {
    return new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        for (const event of events) media.removeEventListener(event, check);
        media.removeEventListener('error', fail);
        abort.signal.removeEventListener('abort', cancel);
      };
      const finish = (error?: Error) => { cleanup(); if (error) reject(error); else resolve(); };
      const check = () => { if (condition()) finish(); };
      const fail = () => finish(new Error(failure || 'Audio could not load.'));
      const cancel = () => finish(new Error('Audio playback cancelled.'));
      const timer = setTimeout(() => finish(new Error('Audio could not prepare. Please retry playback.')), Math.max(0, deadline - Date.now()));
      for (const event of events) media.addEventListener(event, check);
      media.addEventListener('error', fail);
      abort.signal.addEventListener('abort', cancel);
      if (disposed) { cancel(); return; }
      if (failure || media.error) { fail(); return; }
      try { if (start) start(); else check(); } catch (error) { finish(error instanceof Error ? error : new Error(String(error))); }
    });
  }

  return {
    async ready() {
      const deadline = Date.now() + timeoutMs;
      await wait(['loadedmetadata', 'loadeddata', 'canplay'], () => media.readyState >= 1, deadline);
      if (Math.abs(media.currentTime - offset) > 0.001 || media.seeking) {
        // Installing the listener before assigning currentTime handles cached/fast seeks too.
        // Do not poll currentTime: browsers expose the requested time before seeking finishes.
        await wait(['seeked'], () => !media.seeking && Math.abs(media.currentTime - offset) < 0.02,
          deadline, () => { media.currentTime = offset; });
      }
      await wait(['loadeddata', 'canplay', 'canplaythrough'], () => !media.seeking && media.readyState >= 3, deadline);
      if (!disposed) prepared = true;
    },
    async play() {
      if (disposed) return;
      if (!prepared) throw new Error('Audio is not prepared.');
      // Resolve only when playback actually starts, so loading is not counted as note duration.
      await media.play();
    },
    async fadeOut() {
      for (let step = 4; step >= 0 && !disposed; step--) {
        media.volume = 0.45 * step / 5;
        await new Promise((resolve) => setTimeout(resolve, 8));
      }
      if (!disposed) media.pause();
    },
    error: () => failure,
    dispose() {
      if (disposed) return;
      disposed = true;
      abort.abort();
      media.removeEventListener('error', onError);
      media.pause();
      media.removeAttribute('src');
      media.load();
    },
  };
}
