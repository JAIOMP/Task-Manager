<script setup lang="ts">
import { ref } from 'vue';
import type { Priority } from '@/configs/types';
import { useTasks } from '@/composables/useTasks';

const inputEl = ref<HTMLInputElement | null>(null);
defineExpose({ inputEl });

const { addTask } = useTasks();

const title = ref('');
const focused = ref(false);
const priority = ref<Priority>(null);
const dueDate = ref('');
const tagInput = ref('');
const tags = ref<string[]>([]);

function addTagFromInput() {
  const parts = tagInput.value.split(/[,]/).map((t) => t.trim()).filter(Boolean);
  parts.forEach((p) => {
    if (!tags.value.includes(p)) tags.value = [...tags.value, p];
  });
  tagInput.value = '';
}

function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag);
}

function onTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addTagFromInput();
  }
}

function submit() {
  if (!title.value.trim()) return;
  addTagFromInput();
  addTask({
    title: title.value,
    priority: priority.value,
    dueDate: dueDate.value || null,
    tags: [...tags.value],
  });
  title.value = '';
  priority.value = null;
  dueDate.value = '';
  tags.value = [];
  tagInput.value = '';
}

function setPriority(p: Priority) {
  priority.value = priority.value === p ? null : p;
}
</script>

<template>
  <form class="create" @submit.prevent="submit">
    <div class="create__row">
      <input
        ref="inputEl"
        v-model="title"
        type="text"
        class="create__input"
        placeholder="Add a task"
        aria-label="New task title"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button type="submit" class="create__add">Add</button>
    </div>

    <div v-show="focused || title" class="create__quick" @mousedown.prevent>
      <div class="create__priority" role="group" aria-label="Priority">
        <button
          type="button"
          class="create__prio high"
          :class="{ 'is-active': priority === 'high' }"
          @click="setPriority('high')"
        >
          High
        </button>
        <button
          type="button"
          class="create__prio medium"
          :class="{ 'is-active': priority === 'medium' }"
          @click="setPriority('medium')"
        >
          Medium
        </button>
        <button
          type="button"
          class="create__prio low"
          :class="{ 'is-active': priority === 'low' }"
          @click="setPriority('low')"
        >
          Low
        </button>
      </div>
      <input v-model="dueDate" type="date" aria-label="Due date" />
      <div class="create__tags">
        <input
          v-model="tagInput"
          type="text"
          placeholder="Tags"
          aria-label="Tags"
          @keydown="onTagKeydown"
          @blur="addTagFromInput"
        />
        <span v-for="tag in tags" :key="tag" class="create__tag">
          {{ tag }}
          <button type="button" aria-label="Remove tag" @click="removeTag(tag)">×</button>
        </span>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
.create {
  margin: 16px 0;
  text-align: left;
}

.create__row {
  display: flex;
  gap: 8px;
}

.create__input {
  flex: 1;
  height: 44px;
  font-size: 16px;
}

.create__add {
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-weight: 700;

  &:hover {
    background: var(--primary-hover);
  }
}

.create__quick {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
  padding: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.create__priority {
  display: flex;
  gap: 4px;
}

.create__prio {
  height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;

  &.is-active.high,
  &.high:hover { color: var(--priority-high); border-color: var(--priority-high); }
  &.is-active.medium,
  &.medium:hover { color: var(--priority-medium); border-color: var(--priority-medium); }
  &.is-active.low,
  &.low:hover { color: var(--priority-low); border-color: var(--priority-low); }
}

.create__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  flex: 1;
  min-width: 140px;

  input {
    flex: 1;
    min-width: 100px;
    height: 32px;
  }
}

.create__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--bg-muted);
  font-size: 12px;

  button {
    border: none;
    background: transparent;
    padding: 0;
    height: auto;
    color: var(--text-muted);
  }
}
</style>
