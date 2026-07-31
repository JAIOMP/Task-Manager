import { computed, ref, watch } from 'vue';
import type { TodoloPrefs, TaskFilter, SortKey, SortDirection } from '@/configs/types';
import { DEFAULT_PREFS, loadPrefs, savePrefs } from '@/utils/storage';

const prefs = ref<TodoloPrefs>({ ...loadPrefs() });
let initialized = false;

function persist() {
  savePrefs(prefs.value);
}

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
}

export function usePrefs() {
  if (!initialized) {
    initialized = true;
    applyTheme(prefs.value.theme);
    watch(prefs, persist, { deep: true });
  }

  const theme = computed(() => prefs.value.theme);
  const filter = computed(() => prefs.value.filter);
  const sortKey = computed(() => prefs.value.sortKey);
  const sortDirection = computed(() => prefs.value.sortDirection);
  const activeListId = computed(() => prefs.value.activeListId);
  const tagFilter = computed(() => prefs.value.tagFilter);
  const sidebarCollapsed = computed(() => prefs.value.sidebarCollapsed);

  function toggleTheme() {
    prefs.value.theme = prefs.value.theme === 'dark' ? 'light' : 'dark';
    applyTheme(prefs.value.theme);
  }

  function setFilter(value: TaskFilter) {
    prefs.value.filter = value;
  }

  function setSort(key: SortKey) {
    if (prefs.value.sortKey === key) {
      prefs.value.sortDirection = prefs.value.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      prefs.value.sortKey = key;
      prefs.value.sortDirection = 'asc';
    }
  }

  function setSortKey(key: SortKey) {
    if (prefs.value.sortKey !== key) {
      prefs.value.sortKey = key;
      prefs.value.sortDirection = 'asc';
    }
  }

  function toggleSortDirection() {
    prefs.value.sortDirection = prefs.value.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  function setSortDirection(dir: SortDirection) {
    prefs.value.sortDirection = dir;
  }

  function setActiveListId(id: string | null) {
    prefs.value.activeListId = id;
  }

  function setTagFilter(tag: string | null) {
    prefs.value.tagFilter = tag;
  }

  function setSidebarCollapsed(collapsed: boolean) {
    prefs.value.sidebarCollapsed = collapsed;
  }

  function resetPrefs() {
    prefs.value = { ...DEFAULT_PREFS };
    applyTheme(prefs.value.theme);
  }

  return {
    prefs,
    theme,
    filter,
    sortKey,
    sortDirection,
    activeListId,
    tagFilter,
    sidebarCollapsed,
    toggleTheme,
    setFilter,
    setSort,
    setSortKey,
    toggleSortDirection,
    setSortDirection,
    setActiveListId,
    setTagFilter,
    setSidebarCollapsed,
    resetPrefs,
  };
}
