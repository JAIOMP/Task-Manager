<script setup lang="ts">
import { computed } from 'vue';
import type { TaskFilter } from '@/configs/types';
import { usePrefs } from '@/composables/usePrefs';
import { useTasks } from '@/composables/useTasks';
import { isOverdue, todayISO } from '@/utils/taskUtils';

const { filter, setFilter } = usePrefs();
const { tasks } = useTasks();

const tabs: { id: TaskFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'today', label: 'Today' },
  { id: 'overdue', label: 'Overdue' },
];

const overdueCount = computed(() => {
  const today = todayISO();
  return tasks.value.filter((t) => isOverdue(t, today)).length;
});
</script>

<template>
  <div class="filter-bar" role="tablist" aria-label="Task filters">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="filter-bar__tab"
      :class="{ 'is-active': filter === tab.id }"
      :aria-selected="filter === tab.id"
      @click="setFilter(tab.id)"
    >
      {{ tab.label }}
      <span
        v-if="tab.id === 'overdue' && overdueCount > 0"
        class="filter-bar__badge"
      >
        {{ overdueCount }}
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.filter-bar__tab {
  position: relative;
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 8px 12px;
  height: auto;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background: var(--bg-muted);
    color: var(--text);
  }

  &.is-active {
    background: var(--bg-muted);
    color: var(--primary);
  }
}

.filter-bar__badge {
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--overdue);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
</style>
