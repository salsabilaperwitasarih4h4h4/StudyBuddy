export type PageType = 
  | 'login'
  | 'nav'
  | 'menu'
  | 'pomodoro'
  | 'alarm'
  | 'calendar'
  | 'notes'
  | 'dashboard'
  | 'achievements'
  | 'guide';

export interface UserProfile {
  name: string;
  email: string;
  nim: string; // NIM / NISN
  university: string; // Universitas / Sekolah
  avatar: string;
  isLoggedIn: boolean;
}

export type AlarmTone = 'lonceng' | 'digital' | 'lembut';

export interface AlarmItem {
  id: string;
  title: string;
  datetime: string; // ISO string or YYYY-MM-DDTHH:mm
  tone: AlarmTone;
  enabled: boolean;
  ringing?: boolean;
  dismissed?: boolean;
}

export type TaskPriority = 'Rendah' | 'Sedang' | 'Tinggi';

export interface CalendarTask {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm (e.g., 23:59)
  course?: string; // Mata kuliah / Mata Pelajaran
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface LectureNote {
  id: string;
  title: string;
  lecturer?: string;
  course?: string;
  content: string;
  files: AttachedFile[];
  createdAt: string;
}

export type PlantCondition = 'subur' | 'layu' | 'mati';

export interface PlantState {
  streakDays: number;
  totalPomodoros: number;
  lastWateredDate: string; // YYYY-MM-DD
  condition: PlantCondition;
  healthPercent: number; // 0 - 100
  flowerCount: number; // 0 to 5 flowers blooming as consistency grows
}

export interface StudyDayLog {
  date: string; // YYYY-MM-DD
  minutes: number;
  sessions: number;
}
