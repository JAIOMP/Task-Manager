<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SortKey } from '@/configs/types';
import { usePrefs } from '@/composables/usePrefs';
import { useTasks } from '@/composables/useTasks';
import { tagColor } from '@/utils/taskUtils';

const emit = defineEmits<{
  (event: 'open-export'): void;
}>();

const searchEl = ref<HTMLInputElement | null>(null);

defineExpose({ searchEl });

const {
  theme,
  sortKey,
  sortDirection,
  tagFilter,
  toggleTheme,
  setSortKey,
  toggleSortDirection,
  setTagFilter,
} = usePrefs();

const {
  searchQuery,
  setSearch,
  clearSearch,
  filteredTasks,
  allTags,
  selectionMode,
  enterSelectionMode,
  exitSelectionMode,
  selectAllVisible,
  selectedIds,
  clearSelection,
} = useTasks();

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'manual', label: 'Manual order' },
  { key: 'dueDate', label: 'Due date' },
  { key: 'priority', label: 'Priority' },
  { key: 'createdAt', label: 'Date created' },
  { key: 'alphabetical', label: 'Alphabetical' },
];

const resultCount = computed(() => filteredTasks.value.length);
const allSelected = computed(() => {
  const visible = filteredTasks.value;
  return visible.length > 0 && visible.every((t) => selectedIds.value.has(t.id));
});

function onSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    clearSearch();
    (e.target as HTMLInputElement).blur();
  }
}

function onSortChange(e: Event) {
  const key = (e.target as HTMLSelectElement).value as SortKey;
  setSortKey(key);
}

function toggleSelectAll() {
  if (allSelected.value) clearSelection();
  else selectAllVisible();
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__brand-row">
      <h1 class="toolbar__brand">Todolo</h1>
      <button
        type="button"
        class="toolbar__icon-btn"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <span v-if="theme === 'dark'">☀</span>
        <span v-else>☾</span>
      </button>
    </div>

    <div class="toolbar__row">
      <div class="toolbar__search">
        <input
          ref="searchEl"
          type="search"
          placeholder="Search tasks"
          :value="searchQuery"
          aria-label="Search tasks"
          @input="setSearch(($event.target as HTMLInputElement).value)"
          @keydown="onSearchKeydown"
        />
        <p v-if="searchQuery.trim()" class="toolbar__search-count">
          {{ resultCount }} results for '{{ searchQuery.trim() }}'
        </p>
      </div>

      <div class="toolbar__actions">
        <label class="toolbar__select-wrap">
          <span class="sr-only">Sort</span>
          <select
            :value="sortKey"
            aria-label="Sort tasks"
            @change="onSortChange"
          >
            <option v-for="opt in sortOptions" :key="opt.key" :value="opt.key">
              {{ opt.label }}
            </option>
          </select>
        </label>
        <button
          type="button"
          class="toolbar__btn toolbar__btn--ghost"
          :aria-label="sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'"
          @click="toggleSortDirection"
        >
          {{ sortDirection === 'asc' ? '↑' : '↓' }}
        </button>

        <label class="toolbar__select-wrap">
          <span class="sr-only">Filter by tag</span>
          <select
            :value="tagFilter ?? ''"
            aria-label="Filter by tag"
            @change="setTagFilter(($event.target as HTMLSelectElement).value || null)"
          >
            <option value="">All tags</option>
            <option v-for="tag in allTags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </label>

        <button
          v-if="!selectionMode"
          type="button"
          class="toolbar__btn"
          @click="enterSelectionMode"
        >
          Select
        </button>
        <template v-else>
          <label class="toolbar__check">
            <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            Select all
          </label>
          <button type="button" class="toolbar__btn toolbar__btn--ghost" @click="exitSelectionMode">
            Cancel
          </button>
        </template>

        <button type="button" class="toolbar__btn toolbar__btn--ghost" @click="emit('open-export')">
          Export / import
        </button>
      </div>
    </div>

    <div v-if="tagFilter" class="toolbar__active-tag">
      Filtering by
      <span class="toolbar__tag-pill" :style="{ background: tagColor(tagFilter) }">{{ tagFilter }}</span>
      <button type="button" class="toolbar__clear" @click="setTagFilter(null)">Clear</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.toolbar__brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toolbar__brand {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.02em;
  color: var(--text);
}

.toolbar__icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  font-size: 18px;
  display: grid;
  place-items: center;
  padding: 0;

  &:hover {
    background: var(--bg-muted);
  }
}

.toolbar__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.toolbar__search {
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
  }
}

.toolbar__search-count {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--text-muted);
  text-align: left;
}

.toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.toolbar__select-wrap {
  position: relative;
  display: inline-flex;
}

.toolbar__select-wrap select {
  height: 40px;
  min-width: 0;
  width: auto;
  max-width: 180px;
  padding: 8px 28px 8px 12px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: var(--bg-elevated);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7585' d='M2.5 4.5L6 8l3.5-3.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  cursor: pointer;
}

html[data-theme='dark'] .toolbar__select-wrap select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239aa6b8' d='M2.5 4.5L6 8l3.5-3.5'/%3E%3C/svg%3E");
}

.toolbar__btn {
  height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  border: none;
  background: var(--primary);
  color: #fff;
  font-weight: 600;

  &:hover {
    background: var(--primary-hover);
  }

  &--ghost {
    background: var(--bg-elevated);
    color: var(--text);
    border: 1px solid var(--border);

    &:hover {
      background: var(--bg-muted);
    }
  }
}

.toolbar__check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.toolbar__active-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.toolbar__tag-pill {
  color: #fff;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.toolbar__clear {
  background: none;
  border: none;
  color: var(--primary);
  padding: 0;
  height: auto;
  text-decoration: underline;
  font-weight: 600;
}
</style>
