import { SEED_USERS, SEED_COURSES, SEED_ASSIGNMENTS, SEED_GROUPS, SEED_SUBMISSIONS } from './mockData';

const STORAGE_KEYS = {
  USERS: 'joineazy_users',
  COURSES: 'joineazy_courses',
  ASSIGNMENTS: 'joineazy_assignments',
  GROUPS: 'joineazy_groups',
  SUBMISSIONS: 'joineazy_submissions',
  AUTH_TOKEN: 'joineazy_auth_token',
  CURRENT_USER: 'joineazy_current_user',
};

// Safe JSON parser
export const getStorageItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

// Safe JSON serializer
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

// Initialize seed data if not present
export const initializeDatabase = (force = false) => {
  if (force || !localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStorageItem(STORAGE_KEYS.USERS, SEED_USERS);
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.COURSES)) {
    setStorageItem(STORAGE_KEYS.COURSES, SEED_COURSES);
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, SEED_ASSIGNMENTS);
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.GROUPS)) {
    setStorageItem(STORAGE_KEYS.GROUPS, SEED_GROUPS);
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    setStorageItem(STORAGE_KEYS.SUBMISSIONS, SEED_SUBMISSIONS);
  }
};

export const resetDatabaseToSeed = () => {
  initializeDatabase(true);
};

export { STORAGE_KEYS };
