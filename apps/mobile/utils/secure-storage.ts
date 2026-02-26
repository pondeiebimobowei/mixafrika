import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  getItem: async (key: string) => {
    const result = await SecureStore.getItemAsync(key);
    return result ? result : null;
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};
