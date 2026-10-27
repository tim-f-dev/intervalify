import type { Progress } from './progress';

/** Only changes access in memory; best scores and canonical save data remain real. */
export function withTestAccess(progress: Progress, enabled: boolean): Progress {
  if (!enabled) return progress;
  return { ...progress, unlockedLevels: Array.from({ length: 100 }, (_, i) => i + 1),
    chapters: progress.chapters.map((pack) => ({ ...pack, unlocked: true })) };
}
