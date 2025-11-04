// LocalStorage utility functions for data persistence

const STORAGE_KEYS = {
  CONVERSATIONS: 'krux_conversations',
  USERS: 'krux_users',
  LOAN_APPLICATIONS: 'krux_loan_applications',
  AUTH_USER: 'krux_auth_user',
} as const;

// Generic localStorage functions
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const clearAllLocalStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Specific storage functions
export const saveConversations = (conversations: any[]): void => {
  saveToLocalStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
};

export const getConversations = (): any[] => {
  return getFromLocalStorage<any[]>(STORAGE_KEYS.CONVERSATIONS) || [];
};

export const saveAuthUser = (user: any): void => {
  saveToLocalStorage(STORAGE_KEYS.AUTH_USER, user);
};

export const getAuthUser = (): any | null => {
  return getFromLocalStorage(STORAGE_KEYS.AUTH_USER);
};

export const clearAuthUser = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.AUTH_USER);
};

export const saveLoanApplications = (applications: any[]): void => {
  saveToLocalStorage(STORAGE_KEYS.LOAN_APPLICATIONS, applications);
};

export const getLoanApplications = (): any[] => {
  return getFromLocalStorage<any[]>(STORAGE_KEYS.LOAN_APPLICATIONS) || [];
};

