<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { Task, TaskList } from '@/configs/types';
import { usePrefs } from '@/composables/usePrefs';
import { useTasks } from '@/composables/useTasks';
import {
  formatDueDate,
  isOverdue,
  priorityBorderColor,
  tagColor,
  todayISO,
} from '@/utils/taskUtils';

const props = defineProps<{
  task: Task;
  list?: TaskList;
  showListDot?: boolean;
}>();

const {
  selectionMode,
  selectedIds,
  focusedTaskId,
  toggleComplete,
  deleteTask,
  openDetail,
  toggleSelect,
  setFocusedTask,
} = useTasks();

const { sortKey } = usePrefs();

const rowRef = ref<HTMLElement | null>(null);
const swipeX = ref(0);
const swiping = ref(false);
let startX = 0;
let startY = 0;
let tracking = false;
let axis: 'x' | 'y' | null = null;

const selected = computed(() => selectedIds.value.has(props.task.id));
const focused = computed(() => focusedTaskId.value === props.task.id);
const overdue = computed(() => isOverdue(props.task, todayISO()));
const dueLabel = computed(() => formatDueDate(props.task.dueDate));
const borderColor = computed(() => priorityBorderColor(props.task.priority));
const subtaskProgress = computed(() => {
  const subs = props.task.subtasks;
  if (!subs.length) return null;
  const done = subs.filter((s) => s.completed).length;
  return `${done}/${subs.length}`;
});
const canDrag = computed(() => sortKey.value === 'manual' && !selectionMode.value);

function onTitleClick() {
  openDetail(props.task.id);
}

function onPointerDown(e: PointerEvent) {
  if (selectionMode.value) return;
  if ((e.target as HTMLElement).closest('.task-row__handle, .task-row__check, button, a')) return;
  tracking = true;
  axis = null;
  startX = e.clientX;
  startY = e.clientY;
  swiping.value = true;
  rowRef.value?.setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!tracking) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (!axis) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (axis === 'y') {
      tracking = false;
      swipeX.value = 0;
      swiping.value = false;
      return;
    }
  }
  if (axis === 'x') {
    swipeX.value = Math.max(-100, Math.min(100, dx));
  }
}

function onPointerUp() {
  if (!tracking && !swiping.value) return;
  tracking = false;
  const x = swipeX.value;
  if (x <= -64) {
    deleteTask(props.task.id);
  } else if (x >= 64) {
    if (!props.task.completed) toggleComplete(props.task.id);
  }
  swipeX.value = 0;
  swiping.value = false;
  axis = null;
}

onMounted(() => {
  // touch-action handled via CSS
});
onUnmounted(() => {
  tracking = false;
});
</script>

<template>
  <div
    ref="rowRef"
    class="task-row"
    :class="{
      'is-completed': task.completed,
      'is-selected': selected,
      'is-focused': focused,
      'is-swiping': swiping,
    }"
    :style="{
      borderLeftColor: borderColor || 'transparent',
    }"
    :data-id="task.id"
    tabindex="0"
    @focus="setFocusedTask(task.id)"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="task-row__actions-bg">
      <span class="task-row__action complete">Complete</span>
      <span class="task-row__action delete">Delete</span>
    </div>

    <div
      class="task-row__content"
      :style="{ transform: swipeX ? `translateX(${swipeX}px)` : undefined }"
    >
      <span
        v-if="canDrag"
        class="task-row__handle"
        aria-hidden="true"
        title="Drag to reorder"
      >⠿</span>

      <label v-if="selectionMode" class="task-row__select">
        <input
          type="checkbox"
          :checked="selected"
          @change="toggleSelect(task.id)"
        />
      </label>

      <button
        type="button"
        class="task-row__check"
        :aria-label="task.completed ? 'Mark incomplete' : 'Mark complete'"
        @click="toggleComplete(task.id)"
      >
        <span class="task-row__checkbox" :class="{ 'is-on': task.completed }" />
      </button>

      <div class="task-row__main">
        <button type="button" class="task-row__title" @click="onTitleClick">
          <span
            v-if="showListDot && list"
            class="task-row__list-dot"
            :style="{ background: list.color }"
            :title="list.name"
          />
          {{ task.title }}
          <span v-if="subtaskProgress" class="task-row__subtasks">{{ subtaskProgress }}</span>
        </button>

        <div class="task-row__meta">
          <span
            v-if="dueLabel"
            class="task-row__due"
            :class="{ 'is-overdue': overdue }"
          >
            {{ dueLabel }}
          </span>
          <span v-if="overdue" class="task-row__badge">Overdue</span>
          <span
            v-for="tag in task.tags"
            :key="tag"
            class="task-row__tag"
            :style="{ background: tagColor(tag) }"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <button
        type="button"
        class="task-row__delete"
        aria-label="Delete task"
        @click="deleteTask(task.id)"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-row {
  position: relative;
  border-left: 3px solid transparent;
  background: var(--bg-elevated);
  border-radius: 10px;
  margin-bottom: 8px;
  overflow: hidden;
  touch-action: pan-y;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;

  &.is-focused {
    box-shadow: 0 0 0 2px var(--focus-ring);
  }

  &.is-selected {
    background: var(--bg-muted);
  }

  &.is-swiping .task-row__content {
    transition: none;
  }
}

.task-row__actions-bg {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  pointer-events: none;
}

.task-row__action {
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  width: 100px;

  &.complete {
    background: var(--success);
    justify-content: flex-start;
  }

  &.delete {
    background: var(--danger);
    justify-content: flex-end;
    margin-left: auto;
  }
}

.task-row__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 12px 12px 8px;
  background: var(--bg-elevated);
  transition: transform 0.2s ease;
}

.task-row.is-selected .task-row__content,
.task-row.is-completed .task-row__content {
  background: inherit;
}

.task-row__handle {
  opacity: 0;
  cursor: grab;
  color: var(--text-muted);
  font-size: 14px;
  padding: 4px;
  user-select: none;
  touch-action: none;

  .task-row:hover & {
    opacity: 1;
  }
}

.task-row__select input {
  width: 18px;
  height: 18px;
}

.task-row__check {
  border: none;
  background: transparent;
  padding: 0;
  height: auto;
  display: grid;
  place-items: center;
}

.task-row__checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--border);
  display: block;
  transition: background 0.15s ease, border-color 0.15s ease;

  &.is-on {
    background: var(--success);
    border-color: var(--success);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='white' stroke-width='2' d='M3 8l3 3 7-7'/%3E%3C/svg%3E");
    background-size: 14px;
    background-position: center;
    background-repeat: no-repeat;
  }
}

.task-row__main {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.task-row__title {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 15px;
  font-weight: 600;
  padding: 0;
  height: auto;
  text-align: left;
  position: relative;

  span:not(.task-row__list-dot):not(.task-row__subtasks) {
    /* title text */
  }

  .is-completed & {
    color: var(--text-muted);
    text-decoration: line-through;
    text-decoration-color: transparent;
    animation: strike 0.35s ease forwards;
  }
}

@keyframes strike {
  to {
    text-decoration-color: var(--text-muted);
    opacity: 0.75;
  }
}

.task-row__list-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-row__subtasks {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.task-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  align-items: center;
}

.task-row__due {
  font-size: 12px;
  color: var(--text-muted);

  &.is-overdue {
    color: var(--overdue);
    font-weight: 700;
  }
}

.task-row__badge {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: var(--overdue);
  padding: 1px 6px;
  border-radius: 4px;
}

.task-row__tag {
  font-size: 11px;
  color: #fff;
  padding: 1px 7px;
  border-radius: 999px;
}

.task-row__delete {
  opacity: 0;
  border: none;
  background: transparent;
  color: var(--text-muted);
  height: 32px;
  width: 32px;
  padding: 0;
  border-radius: 8px;

  .task-row:hover & {
    opacity: 1;
  }

  &:hover {
    color: var(--danger);
    background: var(--bg-muted);
  }
}
</style>
