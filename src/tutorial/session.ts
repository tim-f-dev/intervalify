import type { Storage } from '../game/progress';

export const TUTORIAL_KEY = 'intervalify.tutorial.hidden.v1';
type State = Readonly<{ ready: boolean; seen: boolean; hidden: boolean; saving: boolean; saveError: boolean }>;
export function tutorialStage(state: State) {
  return !state.ready ? 'loading' : state.seen || state.hidden ? 'play' : 'tutorial';
}

/** The session flag lives only in memory; only an explicit opt-out is persisted. */
export class TutorialSession {
  private state: State = { ready: false, seen: false, hidden: false, saving: false, saveError: false };
  private listeners = new Set<() => void>();
  private loading: Promise<void> | undefined;
  constructor(private storage: Storage) {}
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private update(patch: Partial<State>) { this.state = { ...this.state, ...patch }; this.listeners.forEach((listener) => listener()); }
  initialize() {
    this.loading ??= (async () => {
      let hidden = false;
      try { hidden = await this.storage.getItem(TUTORIAL_KEY) === 'true'; } catch { /* Default to showing the instructions. */ }
      this.update({ ready: true, hidden });
    })();
    return this.loading;
  }
  async dismiss(dontShowAgain: boolean) {
    if (!this.state.ready || this.state.saving || this.state.seen) return;
    if (dontShowAgain) {
      this.update({ saving: true, saveError: false });
      try { await this.storage.setItem(TUTORIAL_KEY, 'true'); }
      catch { this.update({ saving: false, saveError: true }); return; }
    }
    this.update({ seen: true, hidden: dontShowAgain || this.state.hidden, saving: false, saveError: false });
  }
}
