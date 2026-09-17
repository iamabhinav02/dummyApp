import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '../constants/storage';

let memoryCache: Record<StorageKey, unknown> = {} as any;

export const AsyncStorageController = {

  async set<T>(key: StorageKey, value: T): Promise<void> {
    memoryCache[key] = value;
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async get<T>(key: StorageKey): Promise<T | null> {
    if (memoryCache[key]) {
      return memoryCache[key] as T;
    }

    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as T;
    memoryCache[key] = parsed;
    return parsed;
  },

  async remove(key: StorageKey): Promise<void> {
    delete memoryCache[key];
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    memoryCache = {} as any;
    await AsyncStorage.clear();
  },

  // Only called during app launch to update cache from AsyncStorage
  async hydrate(keys: StorageKey[]) {
    const entries = await AsyncStorage.getMany(keys);

    Object.entries(entries).forEach(([key, value]) => {
      if (key && value) {
        memoryCache[key as StorageKey] = JSON.parse(value);
      }
    });
  },
};
