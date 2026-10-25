import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { deriveProgress, ProgressStore, recordResult, starsFor, type Best, type Progress } from './progress';

export type GameResult = { levelId: number; score: number; stars: number; previous: Best; unlockedChapter: number | null };
const store = new ProgressStore(AsyncStorage);
type GameContext = {
  progress: Progress; ready: boolean; loadError: string | null; saveError: string | null;
  saving: boolean; result: GameResult | null; finish(levelId: number, score: number): void;
  retrySave(): void; reload(): void;
};
const Context = createContext<GameContext | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => deriveProgress({}));
  const latest = useRef(progress);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const saveRevision = useRef(0);
  const reload = useCallback(() => {
    void store.load().then((loaded) => { latest.current = loaded; setProgress(loaded); setLoadError(null); setReady(true); })
      .catch((e: unknown) => { setLoadError(e instanceof Error ? e.message : 'Unable to read saved progress.'); });
  }, []);
  useEffect(reload, [reload]);
  const persist = useCallback((value: Progress) => {
    const revision = ++saveRevision.current;
    setSaving(true);
    void store.save(value).then(() => { if (revision === saveRevision.current) setSaveError(null); })
      .catch(() => { if (revision === saveRevision.current) setSaveError('Progress is in memory but could not be saved. Retry before closing the app.'); })
      .finally(() => { if (revision === saveRevision.current) setSaving(false); });
  }, []);
  const finish = useCallback((levelId: number, score: number) => {
    const before = latest.current;
    const next = recordResult(before, levelId, score);
    setResult({ levelId, score, stars: starsFor(score), previous: before.best[levelId] ?? { stars: 0, score: 0 },
      unlockedChapter: next.chapters.find((c, i) => c.unlocked && !before.chapters[i].unlocked)?.id ?? null });
    latest.current = next; setProgress(next); persist(next);
  }, [persist]);
  return <Context.Provider value={{ progress, ready, loadError, saveError, saving, result, finish,
    retrySave: () => persist(latest.current), reload }}>{children}</Context.Provider>;
}
export function useGame() {
  const game = useContext(Context);
  if (!game) throw new Error('GameProvider is missing');
  return game;
}
