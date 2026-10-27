export const STAR_THRESHOLDS = [5, 8, 10] as const;
export const PACK_STAR_REQUIREMENTS = [0, 30, 60, 90, 120] as const;
export type Best = { score: number; stars: number };
export type Progress = {
  version: 1;
  best: Record<number, Best>;
  unlockedLevels: number[];
  chapters: { id: number; stars: number; unlocked: boolean }[];
};
export function starsFor(score: number, thresholds: readonly number[] = STAR_THRESHOLDS): number {
  return thresholds.filter((threshold) => score >= threshold).length;
}
export function chapterOf(level: number) { return Math.ceil(level / 20); }
export function totalStars(best: Record<number, Best>): number {
  return Object.values(best).reduce((sum, result) => sum + result.stars, 0);
}
export function deriveProgress(best: Record<number, Best>): Progress {
  const total = totalStars(best);
  const chapters = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    stars: Object.entries(best).reduce((sum, [id, result]) => sum + (chapterOf(Number(id)) === i + 1 ? result.stars : 0), 0),
    unlocked: false,
  }));
  // Preserve the v1 save shape and original level IDs; only derived pack gates change.
  chapters.forEach((chapter, i) => { chapter.unlocked = total >= PACK_STAR_REQUIREMENTS[i]; });
  const unlockedLevels: number[] = [];
  for (let id = 1; id <= 100; id++) {
    const chapter = chapters[chapterOf(id) - 1];
    if (chapter.unlocked && ((id - 1) % 20 === 0 || (best[id - 1]?.stars ?? 0) >= 1)) unlockedLevels.push(id);
  }
  return { version: 1, best, unlockedLevels, chapters };
}
export function recordResult(progress: Progress, level: number, score: number): Progress {
  if (!progress.unlockedLevels.includes(level)) throw new Error('Level is locked');
  if (!Number.isInteger(score) || score < 0 || score > 10) throw new Error('Score must be an integer from 0 to 10');
  const previous = progress.best[level] ?? { score: 0, stars: 0 };
  return deriveProgress({ ...progress.best, [level]: {
    score: Math.max(previous.score, score), stars: Math.max(previous.stars, starsFor(score)),
  } });
}
export function parseProgress(raw: string | null): Progress {
  if (raw === null) return deriveProgress({});
  const input: unknown = JSON.parse(raw);
  if (!input || typeof input !== 'object' || !('version' in input) || input.version !== 1 || !('best' in input) || !input.best || typeof input.best !== 'object') {
    throw new Error('Unrecognized saved progress. Your existing data has not been overwritten.');
  }
  const best: Record<number, Best> = {};
  for (const [key, value] of Object.entries(input.best)) {
    const id = Number(key);
    if (!Number.isInteger(id) || id < 1 || id > 100 || !value || typeof value !== 'object') continue;
    const candidate = value as Partial<Best>;
    if (typeof candidate.score !== 'number' || !Number.isInteger(candidate.score) || candidate.score < 0 || candidate.score > 10) continue;
    const stars = typeof candidate.stars === 'number' && Number.isInteger(candidate.stars) && candidate.stars >= 0 && candidate.stars <= 3 ? candidate.stars : 0;
    best[id] = { score: candidate.score, stars: Math.max(stars, starsFor(candidate.score)) };
  }
  // Derived values are persisted for inspection, but recomputed to avoid stale unlocks.
  return deriveProgress(best);
}
export interface Storage { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void> }
export const PROGRESS_KEY = 'intervalify.progress.v1';
export class ProgressStore {
  private writes = Promise.resolve();
  constructor(private storage: Storage) {}
  async load() { return parseProgress(await this.storage.getItem(PROGRESS_KEY)); }
  save(progress: Progress) {
    const serialized = JSON.stringify(progress);
    const write = this.writes.catch(() => {}).then(() => this.storage.setItem(PROGRESS_KEY, serialized));
    this.writes = write;
    return write;
  }
}
