<script setup lang="ts">
import type { Task } from '@/configs/types';
import { useTasks } from '@/composables/useTasks';
import { downloadICS } from '@/utils/ics';

const props = defineProps<{
  task: Task;
}>();

const { updateTask } = useTasks();

function exportCalendar() {
  if (!props.task.dueDate) return;
  downloadICS(props.task);
  updateTask(props.task.id, { reminderSet: true });
}
</script>

<template>
  <div v-if="task.dueDate" class="calendar-export">
    <button
      v-if="!task.reminderSet"
      type="button"
      class="calendar-export__btn"
      @click="exportCalendar"
    >
      Add to calendar
    </button>
    <div v-else class="calendar-export__set">
      <span class="calendar-export__muted">Reminder set ✓</span>
      <button type="button" class="calendar-export__again" @click="exportCalendar">
        Export again
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calendar-export {
  margin-top: 8px;
}

.calendar-export__btn {
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-weight: 600;

  &:hover {
    background: var(--primary-hover);
  }
}

.calendar-export__set {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.calendar-export__muted {
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
}

.calendar-export__again {
  background: none;
  border: none;
  color: var(--primary);
  padding: 0;
  height: auto;
  font-size: 13px;
  text-decoration: underline;
  font-weight: 600;
}
</style>
