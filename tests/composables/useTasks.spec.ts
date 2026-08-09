import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useTasks storage bootstrap', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('seeds two example tasks when storage is empty', async () => {
    const { useTasks } = await import('@/composables/useTasks');
    const { tasks } = useTasks();
    expect(tasks.value.length).toBe(2);
    expect(localStorage.getItem('todolo_tasks')).toBeTruthy();
  });

  it('adds and completes a task with undo', async () => {
    const { useTasks } = await import('@/composables/useTasks');
    const { useUndoStack } = await import('@/composables/useUndoStack');
    const api = useTasks();
    const undo = useUndoStack();

    const created = api.addTask({ title: 'New task', priority: 'high' });
    expect(api.tasks.value.some((t) => t.id === created.id)).toBe(true);

    api.deleteTask(created.id);
    expect(api.tasks.value.some((t) => t.id === created.id)).toBe(false);

    undo.undo();
    expect(api.tasks.value.some((t) => t.id === created.id)).toBe(true);
  });
});
