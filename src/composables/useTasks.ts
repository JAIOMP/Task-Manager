import { computed, ref, watch } from 'vue';
import type { Priority, Subtask, Task } from '@/configs/types';
import { loadTasks, saveTasks } from '@/utils/storage';
import {
  completedToday,
  createId,
  createSeedTasks,
  isDueThisWeek,
  isDueToday,
  isOverdue,
  matchesSearch,
  priorityRank,
  todayISO,
  tryMigrateLegacyTasks,
} from '@/utils/taskUtils';
import { usePrefs } from './usePrefs';
import { useUndoStack } from './useUndoStack';

const tasks = ref<Task[]>([]);
const searchQuery = ref('');
const selectedIds = ref<Set<string>>(new Set());
const selectionMode = ref(false);
const focusedTaskId = ref<string | null>(null);
const detailTaskId = ref<string | null>(null);
let initialized = false;

function persist() {
  saveTasks(tasks.value);
}

function nowISO() {
  return new Date().toISOString();
}

function initTasks() {
  const stored = loadTasks();
  if (stored !== null) {
    tasks.value = stored;
    return;
  }
  const migrated = tryMigrateLegacyTasks();
  if (migrated) {
    tasks.value = migrated;
    persist();
    return;
  }
  tasks.value = createSeedTasks();
  persist();
}

export function useTasks() {
  const {
    filter,
    sortKey,
    sortDirection,
    activeListId,
    tagFilter,
  } = usePrefs();
  const undo = useUndoStack();

  if (!initialized) {
    initialized = true;
    initTasks();
    watch(tasks, persist, { deep: true });
  }

  const allTags = computed(() => {
    const set = new Set<string>();
    tasks.value.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  const stats = computed(() => {
    const today = todayISO();
    const total = tasks.value.length;
    const completed = tasks.value.filter((t) => t.completed).length;
    const doneToday = tasks.value.filter((t) => completedToday(t, today)).length;
    const overdue = tasks.value.filter((t) => isOverdue(t, today)).length;
    const dueThisWeek = tasks.value.filter((t) => isDueThisWeek(t, today)).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, doneToday, overdue, dueThisWeek, pct };
  });

  const filteredTasks = computed(() => {
    const today = todayISO();
    let list = [...tasks.value];

    if (activeListId.value) {
      list = list.filter((t) => t.listId === activeListId.value);
    }

    if (tagFilter.value) {
      list = list.filter((t) => t.tags.includes(tagFilter.value!));
    }

    if (searchQuery.value.trim()) {
      list = list.filter((t) => matchesSearch(t, searchQuery.value));
    }

    switch (filter.value) {
      case 'active':
        list = list.filter((t) => !t.completed);
        break;
      case 'completed':
        list = list.filter((t) => t.completed);
        break;
      case 'today':
        list = list.filter((t) => isDueToday(t, today));
        break;
      case 'overdue':
        list = list.filter((t) => isOverdue(t, today));
        break;
      default:
        break;
    }

    const dir = sortDirection.value === 'asc' ? 1 : -1;
    const key = sortKey.value;

    list.sort((a, b) => {
      // Completed to bottom unless viewing completed filter or non-manual custom sort preference
      if (filter.value !== 'completed' && key === 'manual') {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
      }

      let cmp = 0;
      switch (key) {
        case 'dueDate': {
          const ad = a.dueDate ?? '9999-99-99';
          const bd = b.dueDate ?? '9999-99-99';
          cmp = ad.localeCompare(bd);
          break;
        }
        case 'priority':
          cmp = priorityRank(a.priority) - priorityRank(b.priority);
          break;
        case 'createdAt':
          cmp = a.createdAt.localeCompare(b.createdAt);
          break;
        case 'alphabetical':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'manual':
        default:
          cmp = a.order - b.order;
          break;
      }
      return cmp * dir;
    });

    return list;
  });

  const detailTask = computed(() =>
    detailTaskId.value ? tasks.value.find((t) => t.id === detailTaskId.value) ?? null : null
  );

  function addTask(partial: {
    title: string;
    priority?: Priority;
    dueDate?: string | null;
    tags?: string[];
    listId?: string | null;
  }): Task {
    const maxOrder = tasks.value.reduce((m, t) => Math.max(m, t.order), -1);
    const stamp = nowISO();
    const task: Task = {
      id: createId(),
      title: partial.title.trim(),
      description: '',
      completed: false,
      completedAt: null,
      createdAt: stamp,
      updatedAt: stamp,
      priority: partial.priority ?? null,
      dueDate: partial.dueDate ?? null,
      dueTime: null,
      tags: partial.tags ?? [],
      subtasks: [],
      listId: partial.listId ?? activeListId.value,
      order: maxOrder + 1,
      reminderSet: false,
    };
    tasks.value = [...tasks.value, task];
    return task;
  }

  function updateTask(id: string, patch: Partial<Task>) {
    tasks.value = tasks.value.map((t) =>
      t.id === id ? { ...t, ...patch, updatedAt: nowISO() } : t
    );
  }

  function deleteTask(id: string) {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;
    const snapshot = { ...task, subtasks: [...task.subtasks], tags: [...task.tags] };
    tasks.value = tasks.value.filter((t) => t.id !== id);
    if (detailTaskId.value === id) detailTaskId.value = null;
    selectedIds.value.delete(id);
    selectedIds.value = new Set(selectedIds.value);

    undo.push({
      label: 'Task deleted',
      undo: () => {
        tasks.value = [...tasks.value, snapshot].sort((a, b) => a.order - b.order);
      },
    }, 'Task deleted · Undo');
  }

  function toggleComplete(id: string) {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;
    const prev = { completed: task.completed, completedAt: task.completedAt };
    const completed = !task.completed;
    updateTask(id, {
      completed,
      completedAt: completed ? nowISO() : null,
    });
    undo.push({
      label: completed ? 'Task completed' : 'Task marked incomplete',
      undo: () => updateTask(id, prev),
    }, completed ? 'Task completed · Undo' : 'Task marked incomplete · Undo');
  }

  function reorderTasks(orderedIds: string[]) {
    const orderMap = new Map(orderedIds.map((id, i) => [id, i]));
    tasks.value = tasks.value.map((t) =>
      orderMap.has(t.id) ? { ...t, order: orderMap.get(t.id)!, updatedAt: nowISO() } : t
    );
  }

  function openDetail(id: string) {
    detailTaskId.value = id;
    focusedTaskId.value = id;
  }

  function closeDetail() {
    detailTaskId.value = null;
  }

  function setSearch(query: string) {
    searchQuery.value = query;
  }

  function clearSearch() {
    searchQuery.value = '';
  }

  function enterSelectionMode() {
    selectionMode.value = true;
  }

  function exitSelectionMode() {
    selectionMode.value = false;
    selectedIds.value = new Set();
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds.value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    selectedIds.value = next;
  }

  function selectAllVisible() {
    selectedIds.value = new Set(filteredTasks.value.map((t) => t.id));
  }

  function clearSelection() {
    selectedIds.value = new Set();
  }

  function bulkComplete(completed: boolean) {
    const ids = Array.from(selectedIds.value);
    const snapshots = tasks.value
      .filter((t) => ids.includes(t.id))
      .map((t) => ({ id: t.id, completed: t.completed, completedAt: t.completedAt }));

    tasks.value = tasks.value.map((t) =>
      ids.includes(t.id)
        ? {
            ...t,
            completed,
            completedAt: completed ? nowISO() : null,
            updatedAt: nowISO(),
          }
        : t
    );

    undo.push({
      label: completed ? 'Tasks completed' : 'Tasks marked incomplete',
      undo: () => {
        const map = new Map(snapshots.map((s) => [s.id, s]));
        tasks.value = tasks.value.map((t) => {
          const s = map.get(t.id);
          return s ? { ...t, completed: s.completed, completedAt: s.completedAt } : t;
        });
      },
    });
  }

  function bulkDelete() {
    const ids = Array.from(selectedIds.value);
    const snapshots = tasks.value
      .filter((t) => ids.includes(t.id))
      .map((t) => ({ ...t, subtasks: [...t.subtasks], tags: [...t.tags] }));

    tasks.value = tasks.value.filter((t) => !ids.includes(t.id));
    if (detailTaskId.value && ids.includes(detailTaskId.value)) detailTaskId.value = null;
    exitSelectionMode();

    undo.push({
      label: 'Tasks deleted',
      undo: () => {
        tasks.value = [...tasks.value, ...snapshots].sort((a, b) => a.order - b.order);
      },
    }, 'Tasks deleted · Undo');
  }

  function bulkSetPriority(priority: Priority) {
    const ids = Array.from(selectedIds.value);
    tasks.value = tasks.value.map((t) =>
      ids.includes(t.id) ? { ...t, priority, updatedAt: nowISO() } : t
    );
  }

  function bulkAssignList(listId: string | null) {
    const ids = Array.from(selectedIds.value);
    tasks.value = tasks.value.map((t) =>
      ids.includes(t.id) ? { ...t, listId, updatedAt: nowISO() } : t
    );
  }

  function uncategorizeListTasks(listId: string) {
    tasks.value = tasks.value.map((t) =>
      t.listId === listId ? { ...t, listId: null, updatedAt: nowISO() } : t
    );
  }

  function addSubtask(taskId: string, title: string) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task || !title.trim()) return;
    const subtask: Subtask = { id: createId(), title: title.trim(), completed: false };
    updateTask(taskId, { subtasks: [...task.subtasks, subtask] });
  }

  function updateSubtask(taskId: string, subtaskId: string, patch: Partial<Subtask>) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;
    updateTask(taskId, {
      subtasks: task.subtasks.map((s) => (s.id === subtaskId ? { ...s, ...patch } : s)),
    });
  }

  function deleteSubtask(taskId: string, subtaskId: string) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { subtasks: task.subtasks.filter((s) => s.id !== subtaskId) });
  }

  function setFocusedTask(id: string | null) {
    focusedTaskId.value = id;
  }

  function replaceAllTasks(next: Task[]) {
    const previous = tasks.value.map((t) => ({
      ...t,
      subtasks: [...t.subtasks],
      tags: [...t.tags],
    }));
    tasks.value = next.map((t) => ({
      ...t,
      subtasks: [...t.subtasks],
      tags: [...t.tags],
    }));
    detailTaskId.value = null;
    exitSelectionMode();
    undo.push({
      label: 'Import replaced tasks',
      undo: () => {
        tasks.value = previous;
      },
    }, 'Import applied · Undo');
  }

  function mergeImportedTasks(incoming: Task[]) {
    const previous = tasks.value.map((t) => ({
      ...t,
      subtasks: [...t.subtasks],
      tags: [...t.tags],
    }));
    const map = new Map(tasks.value.map((t) => [t.id, t]));
    incoming.forEach((task) => {
      map.set(task.id, {
        ...task,
        subtasks: [...task.subtasks],
        tags: [...task.tags],
      });
    });
    tasks.value = Array.from(map.values()).sort((a, b) => a.order - b.order);
    undo.push({
      label: 'Import merged tasks',
      undo: () => {
        tasks.value = previous;
      },
    }, 'Import applied · Undo');
  }

  return {
    tasks,
    searchQuery,
    selectedIds,
    selectionMode,
    focusedTaskId,
    detailTaskId,
    detailTask,
    filteredTasks,
    allTags,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    openDetail,
    closeDetail,
    setSearch,
    clearSearch,
    enterSelectionMode,
    exitSelectionMode,
    toggleSelect,
    selectAllVisible,
    clearSelection,
    bulkComplete,
    bulkDelete,
    bulkSetPriority,
    bulkAssignList,
    uncategorizeListTasks,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    setFocusedTask,
    replaceAllTasks,
    mergeImportedTasks,
  };
}
