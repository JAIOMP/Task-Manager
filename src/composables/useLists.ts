import { computed, ref, watch } from 'vue';
import type { TaskList } from '@/configs/types';
import { loadLists, saveLists } from '@/utils/storage';
import { createId } from '@/utils/taskUtils';

const lists = ref<TaskList[]>([]);
let initialized = false;

function persist() {
  saveLists(lists.value);
}

export function useLists() {
  if (!initialized) {
    initialized = true;
    const stored = loadLists();
    lists.value = stored ?? [];
    watch(lists, persist, { deep: true });
  }

  const listById = computed(() => {
    const map = new Map<string, TaskList>();
    lists.value.forEach((l) => map.set(l.id, l));
    return map;
  });

  function addList(name: string, color: string): TaskList {
    const list: TaskList = {
      id: createId(),
      name: name.trim() || 'Untitled list',
      color,
      createdAt: new Date().toISOString(),
    };
    lists.value = [...lists.value, list];
    return list;
  }

  function updateList(id: string, patch: Partial<Pick<TaskList, 'name' | 'color'>>) {
    lists.value = lists.value.map((l) => (l.id === id ? { ...l, ...patch } : l));
  }

  function deleteList(id: string) {
    lists.value = lists.value.filter((l) => l.id !== id);
  }

  function getList(id: string | null): TaskList | undefined {
    if (!id) return undefined;
    return listById.value.get(id);
  }

  function replaceAllLists(next: TaskList[]) {
    lists.value = next.map((l) => ({ ...l }));
  }

  function mergeImportedLists(incoming: TaskList[]) {
    const map = new Map(lists.value.map((l) => [l.id, l]));
    incoming.forEach((list) => {
      map.set(list.id, { ...list });
    });
    lists.value = Array.from(map.values());
  }

  return {
    lists,
    listById,
    addList,
    updateList,
    deleteList,
    getList,
    replaceAllLists,
    mergeImportedLists,
  };
}
