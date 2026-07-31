<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '@/configs/types';
import { useTasks } from '@/composables/useTasks';

const props = defineProps<{
  task: Task;
}>();

const { addSubtask, updateSubtask, deleteSubtask } = useTasks();
const draft = ref('');

function onAdd() {
  if (!draft.value.trim()) return;
  addSubtask(props.task.id, draft.value);
  draft.value = '';
}
</script>

<template>
  <div class="subtasks">
    <h3 class="subtasks__heading">Subtasks</h3>
    <ul class="subtasks__list">
      <li v-for="sub in task.subtasks" :key="sub.id" class="subtasks__item">
        <label class="subtasks__label">
          <input
            type="checkbox"
            :checked="sub.completed"
            @change="updateSubtask(task.id, sub.id, { completed: !sub.completed })"
          />
          <span :class="{ 'is-done': sub.completed }">{{ sub.title }}</span>
        </label>
        <button
          type="button"
          class="subtasks__delete"
          aria-label="Delete subtask"
          @click="deleteSubtask(task.id, sub.id)"
        >
          ✕
        </button>
      </li>
    </ul>
    <input
      v-model="draft"
      type="text"
      class="subtasks__input"
      placeholder="Add subtask"
      aria-label="Add subtask"
      @keydown.enter.prevent="onAdd"
    />
  </div>
</template>

<style scoped lang="scss">
.subtasks {
  text-align: left;
}

.subtasks__heading {
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.subtasks__list {
  list-style: none;
  margin: 0 0 8px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.subtasks__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtasks__label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text);

  .is-done {
    text-decoration: line-through;
    color: var(--text-muted);
  }
}

.subtasks__delete {
  border: none;
  background: transparent;
  color: var(--text-muted);
  height: auto;
  padding: 4px;
  font-size: 12px;

  &:hover {
    color: var(--danger);
  }
}

.subtasks__input {
  width: 100%;
  margin-top: 4px;
}
</style>
