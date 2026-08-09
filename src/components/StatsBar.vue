<script setup lang="ts">
import { useTasks } from '@/composables/useTasks';

const { stats } = useTasks();
</script>

<template>
  <div class="stats-bar">
    <span class="stats-bar__item">{{ stats.doneToday }} done today</span>
    <div class="stats-bar__progress" :title="`${stats.completed} / ${stats.total}`">
      <div class="stats-bar__track">
        <div class="stats-bar__fill" :style="{ width: `${stats.pct}%` }" />
      </div>
      <span class="stats-bar__pct">{{ stats.completed }}/{{ stats.total }} · {{ stats.pct }}%</span>
    </div>
    <span class="stats-bar__item" :class="{ 'is-overdue': stats.overdue > 0 }">
      {{ stats.overdue }} overdue
    </span>
    <span class="stats-bar__item">{{ stats.dueThisWeek }} due this week</span>
  </div>
</template>

<style scoped lang="scss">
.stats-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
}

.stats-bar__progress {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 160px;
}

.stats-bar__track {
  flex: 1;
  height: 4px;
  background: var(--bg-muted);
  border-radius: 999px;
  overflow: hidden;
}

.stats-bar__fill {
  height: 100%;
  background: var(--success);
  border-radius: 999px;
  transition: width 0.25s ease;
}

.stats-bar__pct {
  white-space: nowrap;
}

.is-overdue {
  color: var(--overdue);
  font-weight: 600;
}
</style>
