import type { Priority, Task } from '@/configs/types';

export function createId(): string {
  const c = typeof crypto !== 'undefined' ? (crypto as Crypto & { randomUUID?: () => string }) : null;
  if (c?.randomUUID) {
    return c.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isDueToday(task: Task, today = todayISO()): boolean {
  return task.dueDate === today;
}

export function isOverdue(task: Task, today = todayISO()): boolean {
  return !task.completed && !!task.dueDate && task.dueDate < today;
}

export function isDueThisWeek(task: Task, today = todayISO()): boolean {
  if (!task.dueDate || task.completed) return false;
  const [ty, tm, td] = today.split('-').map(Number);
  const start = new Date(ty, tm - 1, td);
  const end = new Date(ty, tm - 1, td + 7);
  const [y, m, d] = task.dueDate.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  return due >= start && due < end;
}

export function completedToday(task: Task, today = todayISO()): boolean {
  if (!task.completedAt) return false;
  return task.completedAt.slice(0, 10) === today;
}

export function formatDueDate(dueDate: string | null, today = todayISO()): string {
  if (!dueDate) return '';
  if (dueDate === today) return 'Today';

  const [ty, tm, td] = today.split('-').map(Number);
  const tomorrowDate = new Date(ty, tm - 1, td + 1);
  const tomorrowISO = [
    tomorrowDate.getFullYear(),
    String(tomorrowDate.getMonth() + 1).padStart(2, '0'),
    String(tomorrowDate.getDate()).padStart(2, '0'),
  ].join('-');
  if (dueDate === tomorrowISO) return 'Tomorrow';

  const [y, m, d] = dueDate.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  const thisYear = ty;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = due.getDate();
  const month = months[due.getMonth()];

  if (due.getFullYear() === thisYear) {
    return `${weekdays[due.getDay()]} ${day} ${month}`;
  }
  return `${day} ${month} ${due.getFullYear()}`;
}

const TAG_PALETTE = [
  '#2D5BFF',
  '#0D9488',
  '#D97706',
  '#DC2626',
  '#7C3AED',
  '#DB2777',
  '#2563EB',
  '#059669',
];

export function tagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}

export function priorityBorderColor(priority: Priority): string | null {
  if (priority === 'high') return 'var(--priority-high)';
  if (priority === 'medium') return 'var(--priority-medium)';
  if (priority === 'low') return 'var(--priority-low)';
  return null;
}

const PRIORITY_RANK: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function priorityRank(priority: Priority): number {
  if (!priority) return 3;
  return PRIORITY_RANK[priority] ?? 3;
}

export function matchesSearch(task: Task, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q) ||
    task.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function createSeedTasks(): Task[] {
  const now = new Date().toISOString();
  const today = todayISO();
  return [
    {
      id: createId(),
      title: 'Welcome to Todolo',
      description: 'Click this task to open the detail panel. Try adding subtasks, tags, and a due date.',
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
      priority: 'medium',
      dueDate: today,
      dueTime: null,
      tags: ['getting-started'],
      subtasks: [
        { id: createId(), title: 'Explore the detail panel', completed: false },
        { id: createId(), title: 'Try dark mode', completed: false },
      ],
      listId: null,
      order: 0,
      reminderSet: false,
    },
    {
      id: createId(),
      title: 'Plan your week',
      description: 'Add due dates and export a calendar reminder with Add to calendar.',
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
      priority: 'high',
      dueDate: null,
      dueTime: null,
      tags: ['planning'],
      subtasks: [],
      listId: null,
      order: 1,
      reminderSet: false,
    },
  ];
}

/** Migrate legacy pinia-persisted tasks if present */
export function tryMigrateLegacyTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem('taskStore');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const legacy = (parsed?.initTasks || parsed?.tasks) as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(legacy) || legacy.length === 0) return null;

    return legacy.map((t, index) => {
      const status = t.status as string | null | undefined;
      const completed = status === 'Completed';
      const now = new Date().toISOString();
      return {
        id: String(t.id ?? createId()),
        title: String(t.title ?? 'Untitled'),
        description: String(t.description ?? ''),
        completed,
        completedAt: completed ? now : null,
        createdAt: now,
        updatedAt: now,
        priority: null as Priority,
        dueDate: t.dueDate ? String(t.dueDate).slice(0, 10) : null,
        dueTime: null,
        tags: Array.isArray(t.tags) ? (t.tags as string[]) : [],
        subtasks: [],
        listId: null,
        order: index,
        reminderSet: false,
      };
    });
  } catch {
    return null;
  }
}
