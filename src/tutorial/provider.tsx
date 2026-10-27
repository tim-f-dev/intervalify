import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { TutorialSession } from './session';

const Context = createContext<TutorialSession | null>(null);
export function TutorialProvider({ children }: { children: ReactNode }) {
  const [session] = useState(() => new TutorialSession(AsyncStorage));
  useEffect(() => { void session.initialize(); }, [session]);
  return <Context.Provider value={session}>{children}</Context.Provider>;
}
export function useTutorial() {
  const session = useContext(Context);
  if (!session) throw new Error('TutorialProvider is missing');
  const state = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
  return { ...state, dismiss: (dontShowAgain: boolean) => session.dismiss(dontShowAgain) };
}
