// Even an accidentally published test export keeps production progression locked.
export const testMode = process.env.EXPO_PUBLIC_UNLOCK_ALL_LEVELS === 'true'
  && typeof window !== 'undefined'
  && ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
