import { createInstance, type i18n, type TFunction } from 'i18next';
import en from './en.json';
import de from './de.json';
import enLevels from './levels.en.json';
import deLevels from './levels.de.json';
import enInstruments from './instruments.en.json';
import deInstruments from './instruments.de.json';

export const resources = {
  en: { translation: en, levels: enLevels, instruments: enInstruments },
  de: { translation: de, levels: deLevels, instruments: deInstruments },
};
export type Language = keyof typeof resources;
export const LANGUAGE_KEY = 'intervalify.language.v1';
export function detectLanguage(locale?: string | null): Language {
  return locale?.toLowerCase().split(/[-_]/)[0] === 'de' ? 'de' : 'en';
}
export function isLanguage(value: unknown): value is Language { return value === 'en' || value === 'de'; }
export function createLocalization() {
  const instance = createInstance();
  void instance.init({ resources, lng: 'en', fallbackLng: 'en', supportedLngs: ['en', 'de'],
    initAsync: false, interpolation: { escapeValue: false }, react: { useSuspense: false } });
  return instance;
}
export function localizedInterval(t: TFunction, semitones: number): string {
  const key = `intervals.${semitones}`;
  return semitones in en.intervals ? t(key) : t('intervals.fallback', { count: semitones });
}
type LanguageStorage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void> };
type Snapshot = Readonly<{ ready: boolean; language: Language; error: 'load' | 'save' | null }>;

/** Independent from game progress; language changes never touch game state or audio. */
export class LanguageController {
  private snapshot: Snapshot = { ready: false, language: 'en', error: null };
  private listeners = new Set<() => void>();
  private initialization: Promise<void> | undefined;
  private writes = Promise.resolve();
  private revision = 0;
  constructor(readonly instance: i18n, private storage: LanguageStorage, private locale: () => string | null | undefined) {}
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  getSnapshot = () => this.snapshot;
  private update(value: Snapshot) { this.snapshot = value; this.listeners.forEach((listener) => listener()); }
  initialize() {
    this.initialization ??= (async () => {
      let language = detectLanguage(this.locale());
      let error: Snapshot['error'] = null;
      try { const stored = await this.storage.getItem(LANGUAGE_KEY); if (isLanguage(stored)) language = stored; }
      catch { error = 'load'; }
      await this.instance.changeLanguage(language);
      this.update({ ready: true, language, error });
    })();
    return this.initialization;
  }
  async setLanguage(language: Language) {
    const revision = ++this.revision;
    await this.instance.changeLanguage(language);
    this.update({ ready: true, language, error: null });
    const write = this.writes.catch(() => {}).then(() => this.storage.setItem(LANGUAGE_KEY, language));
    this.writes = write;
    try { await write; }
    catch { if (revision === this.revision) this.update({ ...this.snapshot, error: 'save' }); }
  }
  async retry() {
    if (this.snapshot.error === 'load') { this.initialization = undefined; await this.initialize(); }
    else await this.setLanguage(this.snapshot.language);
  }
}
