<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import Sortable from 'sortablejs';
import { useLists } from '@/composables/useLists';
import { usePrefs } from '@/composables/usePrefs';
import { useTasks } from '@/composables/useTasks';
import TaskRow from './TaskRow.vue';

const listEl = ref<HTMLElement | null>(null);
let sortable: Sortable | null = null;

const {
  filteredTasks,
  searchQuery,
  tasks,
  reorderTasks,
  clearSearch,
} = useTasks();
const { getList } = useLists();
const { filter, activeListId, tagFilter, sortKey, setFilter, setActiveListId, setTagFilter } =
  usePrefs();

const showListDot = computed(() => activeListId.value === null);
const isEmpty = computed(() => filteredTasks.value.length === 0);

const emptyKind = computed(() => {
  if (!isEmpty.value) return null;
  if (searchQuery.value.trim()) return 'search';
  if (activeListId.value) return 'list';
  if (filter.value !== 'all' || tagFilter.value) return 'filter';
  if (tasks.value.length === 0) return 'all';
  return 'filter';
});

function clearFilter() {
  setFilter('all');
  setTagFilter(null);
}

function clearListFilter() {
  setActiveListId(null);
}

function setupSortable() {
  sortable?.destroy();
  sortable = null;
  if (!listEl.value || sortKey.value !== 'manual') return;

  sortable = Sortable.create(listEl.value, {
    handle: '.task-row__handle',
    animation: 150,
    draggable: '.task-row',
    onEnd: () => {
      if (!listEl.value) return;
      const ids = Array.from(listEl.value.querySelectorAll<HTMLElement>('.task-row'))
        .map((el) => el.dataset.id)
        .filter(Boolean) as string[];
      reorderTasks(ids);
    },
  });
}

watch(
  [sortKey, filteredTasks],
  async () => {
    await nextTick();
    setupSortable();
  },
  { flush: 'post', immediate: true }
);

onBeforeUnmount(() => {
  sortable?.destroy();
});
</script>

<template>
  <div class="task-list-wrap">
    <div v-if="emptyKind" class="task-list__empty">
      <template v-if="emptyKind === 'all'">
        <p>Add your first task above. Press N to start.</p>
      </template>
      <template v-else-if="emptyKind === 'search'">
        <p>No tasks found for '{{ searchQuery.trim() }}'.</p>
        <button type="button" class="task-list__link" @click="clearSearch">Clear search</button>
      </template>
      <template v-else-if="emptyKind === 'list'">
        <p>This list is empty. Add a task and assign it here.</p>
        <button type="button" class="task-list__link" @click="clearListFilter">Show all tasks</button>
      </template>
      <template v-else>
        <p>No tasks match this filter.</p>
        <button type="button" class="task-list__link" @click="clearFilter">Clear filter</button>
      </template>
    </div>

    <div v-else ref="listEl" class="task-list">
      <TaskRow
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :list="getList(task.listId)"
        :show-list-dot="showListDot && !!task.listId"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-list-wrap {
  padding: 12px 0 80px;
  text-align: left;
}

.task-list__empty {
  padding: 48px 16px;
  text-align: center;
  color: var(--text-muted);

  p {
    margin: 0 0 8px;
    font-size: 15px;
  }
}

.task-list__link {
  background: none;
  border: none;
  color: var(--primary);
  text-decoration: underline;
  font-weight: 600;
  height: auto;
  padding: 0;
}

.task-list {
  display: flex;
  flex-direction: column;
}
</style>
