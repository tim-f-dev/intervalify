export type Playback = 'harmonic' | 'ascending' | 'descending';
export type Speed = 'slow' | 'normal' | 'fast';
export type IntervalSound = Readonly<{
  program: number;
  notes: readonly [number, number];
  playback: Playback;
  speed: Speed;
  noteDurationMs: number;
}>;

export interface Voice {
  ready(): Promise<void>;
  play(): void;
  fadeOut(): Promise<void>;
  dispose(): void;
  error(): string | null;
}
export interface AudioDriver {
  initialize(): Promise<void>;
  create(program: number, midi: number): Voice;
}

/** Owns every voice and timer. Replay consumes the same immutable sound. */
export class IntervalPlayer {
  private generation = 0;
  private voices = new Set<Voice>();
  private waits = new Map<ReturnType<typeof setTimeout>, () => void>();
  private current: IntervalSound | null = null;
  constructor(private driver: AudioDriver) {}

  stop() {
    this.generation++;
    for (const [timer, resolve] of this.waits) { clearTimeout(timer); resolve(); }
    this.waits.clear();
    for (const voice of this.voices) voice.dispose();
    this.voices.clear();
  }

  private delay(ms: number) {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => { this.waits.delete(timer); resolve(); }, ms);
      this.waits.set(timer, resolve);
    });
  }

  async play(sound: IntervalSound): Promise<void> {
    this.stop();
    this.current = sound;
    const token = this.generation;
    const valid = () => token === this.generation;
    const local: Voice[] = [];
    try {
      await this.driver.initialize();
      if (!valid()) return;
      for (const note of sound.notes) {
        const voice = this.driver.create(sound.program, note);
        local.push(voice); this.voices.add(voice);
      }
      // Both files are loaded before either note starts.
      await Promise.all(local.map((voice) => voice.ready()));
      if (!valid()) return;
      const checkErrors = () => {
        const error = local.find((v) => v.error())?.error();
        if (error) throw new Error(error);
      };
      const duration = Math.max(180, Math.min(1200, sound.noteDurationMs));
      if (sound.playback === 'harmonic') {
        local.forEach((v) => v.play());
        await this.delay(duration);
        if (!valid()) return;
        checkErrors();
        await Promise.all(local.map((v) => v.fadeOut()));
      } else {
        const gap = { slow: 280, normal: 130, fast: 35 }[sound.speed];
        for (const voice of local) {
          if (!valid()) return;
          voice.play();
          await this.delay(duration);
          if (!valid()) return;
          checkErrors();
          await voice.fadeOut();
          if (!valid()) return;
          await this.delay(gap);
        }
      }
    } catch (error) {
      if (valid()) throw error;
    } finally {
      // An old play call must never dispose a newer question's voices.
      for (const voice of local) {
        if (this.voices.delete(voice)) voice.dispose();
      }
    }
  }

  replay(): Promise<void> {
    return this.current ? this.play(this.current) : Promise.resolve();
  }

  playNote(program: number, midi: number, noteDurationMs = 800) {
    // A single audible voice; the second voice is not needed for this API.
    return this.playSingle(program, midi, noteDurationMs);
  }

  private async playSingle(program: number, midi: number, duration: number) {
    this.stop(); const token = this.generation;
    await this.driver.initialize();
    if (token !== this.generation) return;
    const voice = this.driver.create(program, midi); this.voices.add(voice);
    try {
      await voice.ready();
      if (token !== this.generation) return;
      voice.play(); await this.delay(Math.max(180, Math.min(1200, duration)));
      if (token !== this.generation) return;
      if (voice.error()) throw new Error(voice.error()!);
      await voice.fadeOut();
    } finally { if (this.voices.delete(voice)) voice.dispose(); }
  }
}
