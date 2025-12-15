import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const UUID_KEYCHAIN_KEY = 'treasuresOfTitanUserUuid';
const UUID_STORAGE_KEY = 'userUuid';

/**
 * Generates a RFC4122 v4 compliant UUID
 */
export function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a display name from a UUID
 * Example: "Player_a3f2b"
 */
export function generateDisplayName(uuid: string): string {
  const shortId = uuid.replace(/-/g, '').substring(0, 5);
  return `Player_${shortId}`;
}

/**
 * Gets or creates a user UUID, storing it in both AsyncStorage and SecureStore
 * This UUID is the permanent identity for the user on this device
 */
export async function getOrCreateUserUuid(): Promise<string> {
  // Try AsyncStorage first (faster)
  let uuid = await AsyncStorage.getItem(UUID_STORAGE_KEY);
  if (uuid) return uuid;

  // Try SecureStore (persists across reinstalls)
  uuid = await SecureStore.getItemAsync(UUID_KEYCHAIN_KEY);
  if (uuid) {
    await AsyncStorage.setItem(UUID_STORAGE_KEY, uuid);
    return uuid;
  }

  // Generate new UUID
  uuid = generateUuid();
  await Promise.all([
    SecureStore.setItemAsync(UUID_KEYCHAIN_KEY, uuid),
    AsyncStorage.setItem(UUID_STORAGE_KEY, uuid)
  ]);

  return uuid;
}

/**
 * Gets the stored UUID without creating a new one
 * Returns null if no UUID exists
 */
export async function getStoredUuid(): Promise<string | null> {
  let uuid = await AsyncStorage.getItem(UUID_STORAGE_KEY);
  if (uuid) return uuid;

  uuid = await SecureStore.getItemAsync(UUID_KEYCHAIN_KEY);
  if (uuid) {
    await AsyncStorage.setItem(UUID_STORAGE_KEY, uuid);
    return uuid;
  }

  return null;
}

/**
 * Clears the stored UUID
 * WARNING: This will orphan any data associated with this user
 */
export async function clearStoredUuid(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(UUID_KEYCHAIN_KEY),
    AsyncStorage.removeItem(UUID_STORAGE_KEY)
  ]);
}
