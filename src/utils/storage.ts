import type { Task, TaskList, TodoloPrefs } from '@/configs/types';

export const TASKS_KEY = 'todolo_tasks';
export const LISTS_KEY = 'todolo_lists';
export const PREFS_KEY = 'todolo_prefs';

export const DEFAULT_PREFS: TodoloPrefs = {
  theme: 'light',
  filter: 'all',
  sortKey: 'manual',
  sortDirection: 'asc',
  activeListId: null,
  tagFilter: null,
  sidebarCollapsed: false,
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadTasks(): Task[] | null {
  const raw = localStorage.getItem(TASKS_KEY);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return null;
  }
}

export function saveTasks(tasks: Task[]): void {
  writeJSON(TASKS_KEY, tasks);
}

export function loadLists(): TaskList[] | null {
  const raw = localStorage.getItem(LISTS_KEY);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as TaskList[];
  } catch {
    return null;
  }
}

export function saveLists(lists: TaskList[]): void {
  writeJSON(LISTS_KEY, lists);
}

export function loadPrefs(): TodoloPrefs {
  return { ...DEFAULT_PREFS, ...readJSON<Partial<TodoloPrefs>>(PREFS_KEY, {}) };
}

export function savePrefs(prefs: TodoloPrefs): void {
  writeJSON(PREFS_KEY, prefs);
}
