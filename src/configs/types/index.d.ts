export type Priority = 'high' | 'medium' | 'low' | null;

export type TaskFilter = 'all' | 'active' | 'completed' | 'today' | 'overdue';

export type SortKey = 'manual' | 'dueDate' | 'priority' | 'createdAt' | 'alphabetical';

export type SortDirection = 'asc' | 'desc';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  priority: Priority;
  dueDate: string | null;
  dueTime: string | null;
  tags: string[];
  subtasks: Subtask[];
  listId: string | null;
  order: number;
  reminderSet: boolean;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface TodoloPrefs {
  theme: 'light' | 'dark';
  filter: TaskFilter;
  sortKey: SortKey;
  sortDirection: SortDirection;
  activeListId: string | null;
  tagFilter: string | null;
  sidebarCollapsed: boolean;
}

export type ButtonType = 'button' | 'submit' | 'reset';

/** @deprecated Legacy status type kept for migration */
export type Status = 'Pending' | 'In progress' | 'Completed' | null;
