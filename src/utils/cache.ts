const CACHE_PREFIX = 'victor_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  expiry: number;
}

export const getCache = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(CACHE_PREFIX + key);
    if (!itemStr) return null;

    const item: CacheItem<T> = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error('Error reading from cache', error);
    return null;
  }
};

export const setCache = <T>(key: string, data: T, ttl: number = DEFAULT_TTL): void => {
  try {
    const now = new Date().getTime();
    const item: CacheItem<T> = {
      data,
      expiry: now + ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (error) {
    console.error('Error writing to cache', error);
  }
};

export const clearCache = (key?: string) => {
    if (key) {
        localStorage.removeItem(CACHE_PREFIX + key);
    } else {
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(k);
            }
        });
    }
}

/**
 * @deprecated Use useQuery from TanStack Query instead.
 */
export const fetchWithCache = async <T>(
  url: string, 
  options?: RequestInit, 
  ttl: number = DEFAULT_TTL
): Promise<T> => {
  // Only cache GET requests
  if (options?.method && options.method !== 'GET') {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  const cacheKey = (() => {
    let key = url;
    if (options?.headers) {
        // Simple check for Accept-Language in headers object
        // We assume headers is a plain object as used in our app
        const headers = options.headers as Record<string, string>;
        if (headers['Accept-Language']) {
            key += `|lang:${headers['Accept-Language']}`;
        }
    }
    return key;
  })();

  const cachedData = getCache<T>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const data = await response.json();
  setCache(cacheKey, data, ttl);
  
  return data as T;
};
