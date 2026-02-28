
// Simple in-memory cache for audio blobs to avoid regenerating them during a session
const audioCache = new Map<string, string>();

export const cacheAudio = (key: string, url: string) => {
  audioCache.set(key, url);
};

export const getCachedAudio = (key: string): string | undefined => {
  return audioCache.get(key);
};

export const hasCachedAudio = (key: string): boolean => {
  return audioCache.has(key);
};
