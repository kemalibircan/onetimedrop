import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@filefast_saved_files';
const SERVER_URL_KEY = '@filefast_server_url';
const DEFAULT_SERVER = 'https://onetimedrop.com';

export interface SavedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uri: string;
  addedAt: number;
}

export const fileStore = {
  async getFiles(): Promise<SavedFile[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async addFile(file: Omit<SavedFile, 'id' | 'addedAt'>): Promise<SavedFile> {
    const newFile: SavedFile = {
      ...file,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      addedAt: Date.now(),
    };
    const existing = await fileStore.getFiles();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newFile]));
    return newFile;
  },

  async removeFile(id: string): Promise<void> {
    const existing = await fileStore.getFiles();
    const updated = existing.filter((f) => f.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  async clearFiles(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  async getServerUrl(): Promise<string> {
    try {
      const val = await AsyncStorage.getItem(SERVER_URL_KEY);
      return val || DEFAULT_SERVER;
    } catch {
      return DEFAULT_SERVER;
    }
  },

  async setServerUrl(url: string): Promise<void> {
    await AsyncStorage.setItem(SERVER_URL_KEY, url.replace(/\/$/, ''));
  },
};
