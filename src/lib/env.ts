/**
 * Centralized environment variable access.
 * This handles the differences between Vite's import.meta.env and Node's process.env.
 */

export const getEnv = (key: string): string | undefined => {
  // Try Vite's import.meta.env first (for client-side)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[key]) return import.meta.env[key];
  }
  
  // Try process.env (for server-side or if defined via Vite's define)
  // Note: Vite's define does static replacement, so dynamic access like process.env[key] 
  // might not work for all keys. We handle common ones explicitly.
  if (typeof process !== 'undefined' && process.env) {
    if (key === 'VITE_FIREBASE_API_KEY') return process.env.VITE_FIREBASE_API_KEY;
    if (key === 'VITE_FIREBASE_AUTH_DOMAIN') return process.env.VITE_FIREBASE_AUTH_DOMAIN;
    if (key === 'VITE_FIREBASE_PROJECT_ID') return process.env.VITE_FIREBASE_PROJECT_ID;
    if (key === 'VITE_FIREBASE_STORAGE_BUCKET') return process.env.VITE_FIREBASE_STORAGE_BUCKET;
    if (key === 'VITE_FIREBASE_MESSAGING_SENDER_ID') return process.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
    if (key === 'VITE_FIREBASE_APP_ID') return process.env.VITE_FIREBASE_APP_ID;
    if (key === 'GEMINI_API_KEY') return process.env.GEMINI_API_KEY;
    if (key === 'VITE_GEMINI_API_KEY') return process.env.VITE_GEMINI_API_KEY;
    if (key === 'API_KEY') return process.env.API_KEY;
    if (key === 'VITE_API_KEY') return process.env.VITE_API_KEY;
    
    // Fallback for other keys
    try {
      return (process.env as any)[key];
    } catch (e) {
      return undefined;
    }
  }
  
  return undefined;
};

export const getGeminiApiKey = (): string | undefined => {
  // Priority 1: Explicitly defined via Vite's define (most reliable for our setup)
  // These are replaced as string literals during build/dev
  const fromProcessEnv = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
  if (fromProcessEnv && fromProcessEnv !== 'undefined' && fromProcessEnv !== 'null' && fromProcessEnv.trim() !== '') {
    console.log("env.ts: Found API Key in process.env (Vite define)");
    return fromProcessEnv.trim();
  }

  // Priority 2: Vite's standard env loading (requires VITE_ prefix)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const fromVite = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
    if (fromVite && fromVite.trim() !== '') {
      console.log("env.ts: Found API Key in import.meta.env");
      return fromVite.trim();
    }
  }

  // Priority 3: Dynamic fallback (least reliable in Vite)
  const fallback = getEnv('GEMINI_API_KEY') || getEnv('VITE_GEMINI_API_KEY') || getEnv('API_KEY');
  if (fallback && fallback.trim() !== '') {
    console.log("env.ts: Found API Key via getEnv fallback");
    return fallback.trim();
  }

  console.warn("env.ts: No Gemini API Key found in any environment source!");
  return undefined;
};

export const getFirebaseConfig = () => {
  return {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID'),
  };
};
