import { User } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  // For temporary testing, get user from sessionStorage
  if (typeof window !== 'undefined') {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function getUserCamps(userId: string) {
  // For temporary testing, return empty array
  return [];
}

