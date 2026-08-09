import type { Priority, Subtask, Task, TaskList } from '@/configs/types';
import { createId } from '@/utils/taskUtils';

export const BACKUP_VERSION = 1;

export interface TodoloBackup {
  version: number;
  exportedAt: string;
  tasks: Task[];
  lists: TaskList[];
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTasksJSON(tasks: Task[], lists: TaskList[] = []): void {
  const backup: TodoloBackup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    tasks,
    lists,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  triggerDownload(blob, 'todolo_backup.json');
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportTasksCSV(tasks: Task[]): void {
  const headers = [
    'id',
    'title',
    'description',
    'completed',
    'priority',
    'dueDate',
    'dueTime',
    'tags',
    'createdAt',
    'completedAt',
  ];

  const rows = tasks.map((t) =>
    [
      t.id,
      t.title,
      t.description,
      String(t.completed),
      t.priority ?? '',
      t.dueDate ?? '',
      t.dueTime ?? '',
      t.tags.join(';'),
      t.createdAt,
      t.completedAt ?? '',
    ]
      .map((cell) => csvEscape(String(cell)))
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, 'todolo_tasks.csv');
}

function isPriority(value: unknown): value is Priority {
  return value === 'high' || value === 'medium' || value === 'low' || value === null;
}

function normalizeSubtasks(raw: unknown): Subtask[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const s = item as Record<string, unknown>;
      const title = String(s.title ?? '').trim();
      if (!title) return null;
      return {
        id: String(s.id ?? createId()),
        title,
        completed: Boolean(s.completed),
      };
    })
    .filter(Boolean) as Subtask[];
}

export function normalizeTask(raw: unknown, orderFallback = 0): Task | null {
  if (!raw || typeof raw !== 'object') return null;
  const t = raw as Record<string, unknown>;
  const title = String(t.title ?? '').trim();
  if (!title) return null;

  const now = new Date().toISOString();
  const priority = isPriority(t.priority) ? t.priority : null;
  const tags = Array.isArray(t.tags)
    ? t.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : typeof t.tags === 'string'
      ? String(t.tags)
          .split(';')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  return {
    id: String(t.id ?? createId()),
    title,
    description: String(t.description ?? ''),
    completed: Boolean(t.completed),
    completedAt: t.completedAt ? String(t.completedAt) : null,
    createdAt: String(t.createdAt ?? now),
    updatedAt: String(t.updatedAt ?? now),
    priority,
    dueDate: t.dueDate ? String(t.dueDate).slice(0, 10) : null,
    dueTime: t.dueTime ? String(t.dueTime).slice(0, 5) : null,
    tags,
    subtasks: normalizeSubtasks(t.subtasks),
    listId: t.listId ? String(t.listId) : null,
    order: typeof t.order === 'number' ? t.order : orderFallback,
    reminderSet: Boolean(t.reminderSet),
  };
}

function normalizeList(raw: unknown): TaskList | null {
  if (!raw || typeof raw !== 'object') return null;
  const l = raw as Record<string, unknown>;
  const name = String(l.name ?? '').trim();
  if (!name) return null;
  return {
    id: String(l.id ?? createId()),
    name,
    color: String(l.color ?? '#4A90E2'),
    createdAt: String(l.createdAt ?? new Date().toISOString()),
  };
}

export type ParsedImport = {
  tasks: Task[];
  lists: TaskList[];
  format: 'backup' | 'tasks' | 'csv';
};

export function parseImportJSON(text: string): ParsedImport {
  const data = JSON.parse(text) as unknown;

  if (Array.isArray(data)) {
    const tasks = data
      .map((item, index) => normalizeTask(item, index))
      .filter(Boolean) as Task[];
    if (!tasks.length) throw new Error('No valid tasks found in JSON.');
    return { tasks, lists: [], format: 'tasks' };
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.tasks)) {
      const tasks = obj.tasks
        .map((item, index) => normalizeTask(item, index))
        .filter(Boolean) as Task[];
      const lists = Array.isArray(obj.lists)
        ? (obj.lists.map((item) => normalizeList(item)).filter(Boolean) as TaskList[])
        : [];
      if (!tasks.length && !lists.length) {
        throw new Error('No valid tasks or lists found in backup.');
      }
      return { tasks, lists, format: 'backup' };
    }
  }

  throw new Error('Unrecognized JSON format. Export a Todolo backup or tasks array.');
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

export function parseImportCSV(text: string): ParsedImport {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) throw new Error('CSV file is empty or missing rows.');

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const required = ['title'];
  if (!required.every((h) => headers.includes(h))) {
    throw new Error('CSV must include a title column.');
  }

  const tasks = lines.slice(1).map((line, index) => {
    const cells = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = cells[i] ?? '';
    });

    return normalizeTask(
      {
        ...row,
        completed: row.completed === 'true' || row.completed === '1',
        priority: row.priority || null,
        tags: row.tags || '',
        dueDate: row.dueDate || null,
        dueTime: row.dueTime || null,
        completedAt: row.completedAt || null,
      },
      index
    );
  }).filter(Boolean) as Task[];

  if (!tasks.length) throw new Error('No valid tasks found in CSV.');
  return { tasks, lists: [], format: 'csv' };
}

export async function readImportFile(file: File): Promise<ParsedImport> {
  const text = await file.text();
  const name = file.name.toLowerCase();

  if (name.endsWith('.json') || file.type.includes('json')) {
    return parseImportJSON(text);
  }
  if (name.endsWith('.csv') || file.type.includes('csv') || file.type.includes('excel')) {
    return parseImportCSV(text);
  }

  // Sniff content
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseImportJSON(text);
  }
  return parseImportCSV(text);
}
