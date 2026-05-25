import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// SecureStore only works on native. On web, fallback to localStorage.
const isNative = Platform.OS !== 'web';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'user_data';

// ─── Token ───────────────────────────────────────────────────────────────────

export const saveToken = async (token: string) => {
  try {
    if (isNative) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    console.warn('Error saving token', e);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    if (isNative) {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.warn('Error getting token', e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    if (isNative) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.warn('Error removing token', e);
  }
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const saveUser = async (user: any) => {
  try {
    const value = JSON.stringify(user);
    if (isNative) {
      await SecureStore.setItemAsync(USER_KEY, value);
    } else {
      localStorage.setItem(USER_KEY, value);
    }
  } catch (e) {
    console.warn('Error saving user', e);
  }
};

export const getUser = async (): Promise<any | null> => {
  try {
    let data: string | null = null;
    if (isNative) {
      data = await SecureStore.getItemAsync(USER_KEY);
    } else {
      data = localStorage.getItem(USER_KEY);
    }
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.warn('Error getting user', e);
    return null;
  }
};

export const removeUser = async () => {
  try {
    if (isNative) {
      await SecureStore.deleteItemAsync(USER_KEY);
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.warn('Error removing user', e);
  }
};

// ─── Session ──────────────────────────────────────────────────────────────────

export const saveLastEmail = async (email: string) => {
  try {
    if (isNative) {
      await SecureStore.setItemAsync('last_email', email);
    } else {
      localStorage.setItem('last_email', email);
    }
  } catch (e) {
    console.warn('Error saving last email', e);
  }
};

export const getLastEmail = async (): Promise<string | null> => {
  try {
    if (isNative) {
      return await SecureStore.getItemAsync('last_email');
    }
    return localStorage.getItem('last_email');
  } catch (e) {
    return null;
  }
};

export const removeLastEmail = async () => {
  try {
    if (isNative) {
      await SecureStore.deleteItemAsync('last_email');
    } else {
      localStorage.removeItem('last_email');
    }
  } catch (e) {
    console.warn('Error removing last email', e);
  }
};

export const logout = async () => {
  await removeToken();
  await removeUser();
  // We intentionally DO NOT remove the last email so the user can quickly log back in
};
