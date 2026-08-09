import { describe, it, expect, vi } from 'vitest';
import {
  formatDueDate,
  isOverdue,
  isDueToday,
  matchesSearch,
  tagColor,
  priorityRank,
} from '@/utils/taskUtils';
import type { Task } from '@/configs/types';
import { generateICS } from '@/utils/ics';
import { exportTasksCSV, parseImportCSV, parseImportJSON } from '@/utils/export';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Test',
    description: 'Desc',
    completed: false,
    completedAt: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    priority: null,
    dueDate: null,
    dueTime: null,
    tags: [],
    subtasks: [],
    listId: null,
    order: 0,
    reminderSet: false,
    ...overrides,
  };
}

describe('taskUtils', () => {
  it('formats due dates', () => {
    expect(formatDueDate('2026-07-31', '2026-07-31')).toBe('Today');
    expect(formatDueDate('2026-08-01', '2026-07-31')).toBe('Tomorrow');
  });

  it('detects overdue and today', () => {
    const overdue = makeTask({ dueDate: '2026-07-30' });
    const today = makeTask({ dueDate: '2026-07-31' });
    expect(isOverdue(overdue, '2026-07-31')).toBe(true);
    expect(isDueToday(today, '2026-07-31')).toBe(true);
    expect(isOverdue(makeTask({ dueDate: '2026-07-30', completed: true }), '2026-07-31')).toBe(false);
  });

  it('matches search across title description tags', () => {
    const task = makeTask({ title: 'Buy milk', description: 'From store', tags: ['errands'] });
    expect(matchesSearch(task, 'milk')).toBe(true);
    expect(matchesSearch(task, 'store')).toBe(true);
    expect(matchesSearch(task, 'errands')).toBe(true);
    expect(matchesSearch(task, 'xyz')).toBe(false);
  });

  it('returns deterministic tag colors and priority ranks', () => {
    expect(tagColor('work')).toBe(tagColor('work'));
    expect(priorityRank('high')).toBeLessThan(priorityRank('low'));
    expect(priorityRank(null)).toBeGreaterThan(priorityRank('low'));
  });
});

describe('ics', () => {
  it('generates a VEVENT with alarm', () => {
    const task = makeTask({
      title: 'Call mom',
      dueDate: '2026-08-01',
      dueTime: '10:00',
      description: 'Weekly call',
    });
    const ics = generateICS(task);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Call mom');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:-PT30M');
  });

  it('generates all-day events without time', () => {
    const task = makeTask({ title: 'All day', dueDate: '2026-08-01' });
    const ics = generateICS(task);
    expect(ics).toContain('DTSTART;VALUE=DATE:20260801');
  });
});

describe('export', () => {
  it('builds csv download without throwing', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    // @ts-expect-error test stub
    global.URL.createObjectURL = createObjectURL;
    // @ts-expect-error test stub
    global.URL.revokeObjectURL = revokeObjectURL;

    const click = vi.fn();
    const originalCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreate(tag);
      if (tag === 'a') {
        el.click = click;
      }
      return el;
    });

    exportTasksCSV([makeTask({ tags: ['a', 'b'] })]);
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
  });
});

describe('import', () => {
  it('parses backup JSON with tasks and lists', () => {
    const parsed = parseImportJSON(
      JSON.stringify({
        version: 1,
        tasks: [makeTask({ id: 'a', title: 'Imported' })],
        lists: [{ id: 'l1', name: 'Work', color: '#4A90E2', createdAt: '2026-01-01T00:00:00.000Z' }],
      })
    );
    expect(parsed.format).toBe('backup');
    expect(parsed.tasks[0].title).toBe('Imported');
    expect(parsed.lists[0].name).toBe('Work');
  });

  it('parses legacy tasks array JSON', () => {
    const parsed = parseImportJSON(JSON.stringify([makeTask({ title: 'Legacy' })]));
    expect(parsed.format).toBe('tasks');
    expect(parsed.tasks).toHaveLength(1);
  });

  it('parses CSV exports', () => {
    const csv = [
      'id,title,description,completed,priority,dueDate,dueTime,tags,createdAt,completedAt',
      '1,Buy milk,From store,false,high,2026-08-01,,errands;home,2026-01-01T00:00:00.000Z,',
    ].join('\n');
    const parsed = parseImportCSV(csv);
    expect(parsed.format).toBe('csv');
    expect(parsed.tasks[0].title).toBe('Buy milk');
    expect(parsed.tasks[0].tags).toEqual(['errands', 'home']);
    expect(parsed.tasks[0].priority).toBe('high');
  });
});
