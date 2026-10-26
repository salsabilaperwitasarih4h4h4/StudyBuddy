import { AlarmItem, CalendarTask, LectureNote, PlantCondition, PlantState, StudyDayLog, UserProfile } from '../types';

const USER_KEY = 'studybuddy_user_v2';
const ALARMS_KEY = 'studybuddy_alarms_v2';
const TASKS_KEY = 'studybuddy_tasks_v2';
const NOTES_KEY = 'studybuddy_notes_v2';
const PLANT_KEY = 'studybuddy_plant_v2';
const LOGS_KEY = 'studybuddy_logs_v2';
const SENSOR_KEY = 'studybuddy_sensor_v2';

export const getTodayKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Initial state for fresh start from 0
export const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

// --- SENSOR DETEKSI STATE ---
export const getSensorEnabled = (): boolean => {
  try {
    const raw = localStorage.getItem(SENSOR_KEY);
    return raw !== null ? JSON.parse(raw) : true;
  } catch {
    return true;
  }
};

export const setSensorEnabled = (enabled: boolean) => {
  localStorage.setItem(SENSOR_KEY, JSON.stringify(enabled));
};

// --- ALARMS ---
export const getStoredAlarms = (): AlarmItem[] => {
  try {
    const raw = localStorage.getItem(ALARMS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveAlarms = (alarms: AlarmItem[]) => {
  localStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
};

// --- TASKS ---
export const getStoredTasks = (): CalendarTask[] => {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: CalendarTask[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// --- NOTES ---
export const getStoredNotes = (): LectureNote[] => {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveNotes = (notes: LectureNote[]) => {
  try {
    // Strip heavy base64 if present so localStorage never crashes with QuotaExceededError
    const safeNotes = notes.map((n) => ({
      ...n,
      files: (n.files || []).map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        dataUrl: f.dataUrl && f.dataUrl.length < 50000 ? f.dataUrl : undefined
      }))
    }));
    localStorage.setItem(NOTES_KEY, JSON.stringify(safeNotes));
  } catch (err) {
    console.warn('Gagal menyimpan ke localStorage, mencoba versi tanpa dataUrl', err);
    try {
      const strippedNotes = notes.map((n) => ({
        ...n,
        files: (n.files || []).map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type
        }))
      }));
      localStorage.setItem(NOTES_KEY, JSON.stringify(strippedNotes));
    } catch (e) {
      console.error('LocalStorage penuh total:', e);
    }
  }
};

// --- STUDY LOGS (Starts from ZERO as requested) ---
export const getStoredLogs = (): StudyDayLog[] => {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveLogs = (logs: StudyDayLog[]) => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

// Helper to determine flowers based on total pomodoros
export const computeFlowerCount = (totalPomodoros: number): number => {
  if (totalPomodoros <= 0) return 0;
  if (totalPomodoros === 1) return 1;
  if (totalPomodoros <= 3) return 2;
  if (totalPomodoros <= 5) return 3;
  if (totalPomodoros <= 8) return 4;
  return 5;
};

// --- PLANT STATE (Starts from 0 as requested) ---
export const getStoredPlant = (): PlantState => {
  try {
    const raw = localStorage.getItem(PLANT_KEY);
    if (!raw) {
      return {
        streakDays: 0,
        totalPomodoros: 0,
        lastWateredDate: '',
        condition: 'subur',
        healthPercent: 100,
        flowerCount: 0
      };
    }
    const state: PlantState = JSON.parse(raw);
    return computePlantHealth(state);
  } catch {
    return {
      streakDays: 0,
      totalPomodoros: 0,
      lastWateredDate: '',
      condition: 'subur',
      healthPercent: 100,
      flowerCount: 0
    };
  }
};

export const computePlantHealth = (state: PlantState): PlantState => {
  // If brand new, keep at 0
  if (!state.lastWateredDate || state.totalPomodoros === 0) {
    return { 
      ...state, 
      streakDays: state.streakDays || 0,
      condition: 'subur', 
      healthPercent: 100,
      flowerCount: computeFlowerCount(state.totalPomodoros)
    };
  }

  const today = new Date(getTodayKey()).getTime();
  const lastDate = new Date(state.lastWateredDate).getTime();
  const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

  let condition: PlantCondition = state.condition;
  let healthPercent = state.healthPercent;
  let streak = state.streakDays;

  if (diffDays <= 1) {
    condition = 'subur';
    healthPercent = 100;
  } else if (diffDays <= 3) {
    condition = 'layu';
    healthPercent = Math.max(30, 75 - diffDays * 15);
  } else {
    condition = 'mati';
    healthPercent = Math.max(0, 30 - diffDays * 5);
    streak = 0;
  }

  const flowerCount = condition === 'mati' ? 0 : computeFlowerCount(state.totalPomodoros);

  return {
    ...state,
    streakDays: streak,
    condition,
    healthPercent,
    flowerCount
  };
};

export const savePlant = (plant: PlantState) => {
  localStorage.setItem(PLANT_KEY, JSON.stringify(plant));
};

// Record a completed Pomodoro session (automatically waters the plant & grows flowers!)
export const recordCompletedPomodoro = (minutes: number = 25): { plant: PlantState; logs: StudyDayLog[] } => {
  const today = getTodayKey();
  
  // 1. Update logs
  const logs = getStoredLogs();
  const existingIdx = logs.findIndex(l => l.date === today);
  if (existingIdx >= 0) {
    logs[existingIdx].minutes += minutes;
    logs[existingIdx].sessions += 1;
  } else {
    logs.push({ date: today, minutes, sessions: 1 });
  }
  saveLogs(logs);

  // 2. Update plant automatically (heals, increments streak, increments pomodoro count, blooms flowers!)
  const currentPlant = getStoredPlant();
  const isConsecutive = currentPlant.lastWateredDate && currentPlant.lastWateredDate !== today;
  const newStreak = isConsecutive ? currentPlant.streakDays + 1 : (currentPlant.streakDays || 1);
  const newPomodoroCount = currentPlant.totalPomodoros + 1;
  const newFlowerCount = computeFlowerCount(newPomodoroCount);

  const updatedPlant: PlantState = {
    ...currentPlant,
    streakDays: newStreak,
    totalPomodoros: newPomodoroCount,
    lastWateredDate: today,
    condition: 'subur',
    healthPercent: 100,
    flowerCount: newFlowerCount
  };
  savePlant(updatedPlant);

  return { plant: updatedPlant, logs };
};
