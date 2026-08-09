<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { Priority } from '@/configs/types';
import { useLists } from '@/composables/useLists';
import { useTasks } from '@/composables/useTasks';
import { tagColor } from '@/utils/taskUtils';
import SubtaskList from './SubtaskList.vue';
import CalendarExport from './CalendarExport.vue';

const { detailTask, closeDetail, updateTask } = useTasks();
const { lists } = useLists();

const savedFlash = ref(false);
let flashTimer: ReturnType<typeof setTimeout> | null = null;

const title = ref('');
const description = ref('');
const priority = ref<Priority>(null);
const dueDate = ref('');
const dueTime = ref('');
const tagDraft = ref('');
const listId = ref<string>('');
const descEl = ref<HTMLTextAreaElement | null>(null);

const open = computed(() => !!detailTask.value);
const charCount = computed(() => description.value.length);

watch(
  detailTask,
  (task) => {
    if (!task) return;
    title.value = task.title;
    description.value = task.description;
    priority.value = task.priority;
    dueDate.value = task.dueDate ?? '';
    dueTime.value = task.dueTime ?? '';
    listId.value = task.listId ?? '';
    tagDraft.value = '';
    nextTick(() => autoResize());
  },
  { immediate: true }
);

function flashSaved() {
  savedFlash.value = true;
  if (flashTimer) clearTimeout(flashTimer);
  flashTimer = setTimeout(() => {
    savedFlash.value = false;
  }, 1200);
}

function save(patch: Record<string, unknown>) {
  if (!detailTask.value) return;
  updateTask(detailTask.value.id, patch);
  flashSaved();
}

function onTitleBlur() {
  if (!detailTask.value) return;
  const next = title.value.trim() || detailTask.value.title;
  title.value = next;
  if (next !== detailTask.value.title) save({ title: next });
}

function onDescriptionBlur() {
  if (!detailTask.value) return;
  if (description.value !== detailTask.value.description) {
    save({ description: description.value });
  }
}

function setPriority(p: Priority) {
  priority.value = priority.value === p ? null : p;
  save({ priority: priority.value });
}

function onDueDateBlur() {
  const value = dueDate.value || null;
  save({
    dueDate: value,
    dueTime: value ? dueTime.value || null : null,
    reminderSet: false,
  });
  if (!value) dueTime.value = '';
}

function onDueTimeBlur() {
  if (!dueDate.value) return;
  save({ dueTime: dueTime.value || null, reminderSet: false });
}

function onListChange() {
  save({ listId: listId.value || null });
}

function addTags() {
  if (!detailTask.value) return;
  const parts = tagDraft.value.split(/[,]/).map((t) => t.trim()).filter(Boolean);
  if (!parts.length) return;
  const next = [...detailTask.value.tags];
  parts.forEach((p) => {
    if (!next.includes(p)) next.push(p);
  });
  tagDraft.value = '';
  save({ tags: next });
}

function removeTag(tag: string) {
  if (!detailTask.value) return;
  save({ tags: detailTask.value.tags.filter((t) => t !== tag) });
}

function onTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addTags();
  }
}

function autoResize() {
  const el = descEl.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

function onBackdropClick() {
  closeDetail();
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open && detailTask" class="detail">
      <div class="detail__backdrop" @click="onBackdropClick" />
      <aside class="detail__panel" role="dialog" aria-label="Task details" @click.stop>
        <header class="detail__header">
          <span class="detail__saved" :class="{ 'is-visible': savedFlash }">Saved</span>
          <button type="button" class="detail__close" aria-label="Close" @click="closeDetail">
            ✕
          </button>
        </header>

        <div class="detail__body">
          <input
            v-model="title"
            type="text"
            class="detail__title"
            aria-label="Title"
            @blur="onTitleBlur"
          />

          <label class="detail__field">
            <span>Description</span>
            <textarea
              ref="descEl"
              v-model="description"
              rows="3"
              aria-label="Description"
              @input="autoResize"
              @blur="onDescriptionBlur"
            />
            <span class="detail__count">{{ charCount }} characters</span>
          </label>

          <div class="detail__field">
            <span>Priority</span>
            <div class="detail__priority">
              <button
                type="button"
                class="high"
                :class="{ 'is-active': priority === 'high' }"
                @click="setPriority('high')"
              >
                High
              </button>
              <button
                type="button"
                class="medium"
                :class="{ 'is-active': priority === 'medium' }"
                @click="setPriority('medium')"
              >
                Medium
              </button>
              <button
                type="button"
                class="low"
                :class="{ 'is-active': priority === 'low' }"
                @click="setPriority('low')"
              >
                Low
              </button>
            </div>
          </div>

          <label class="detail__field">
            <span>Due date</span>
            <input v-model="dueDate" type="date" @blur="onDueDateBlur" @change="onDueDateBlur" />
          </label>

          <label v-if="dueDate" class="detail__field">
            <span>Due time</span>
            <input v-model="dueTime" type="time" @blur="onDueTimeBlur" @change="onDueTimeBlur" />
          </label>

          <CalendarExport :task="detailTask" />

          <div class="detail__field">
            <span>Tags</span>
            <div class="detail__tags">
              <span
                v-for="tag in detailTask.tags"
                :key="tag"
                class="detail__tag"
                :style="{ background: tagColor(tag) }"
              >
                {{ tag }}
                <button type="button" aria-label="Remove tag" @click="removeTag(tag)">×</button>
              </span>
              <input
                v-model="tagDraft"
                type="text"
                placeholder="Add tag"
                @keydown="onTagKeydown"
                @blur="addTags"
              />
            </div>
          </div>

          <label class="detail__field">
            <span>List</span>
            <select v-model="listId" @change="onListChange">
              <option value="">Uncategorized</option>
              <option v-for="list in lists" :key="list.id" :value="list.id">
                {{ list.name }}
              </option>
            </select>
          </label>

          <SubtaskList :task="detailTask" />
        </div>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@import '@/assets/styles/media-queries';

.detail {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  justify-content: flex-end;
}

.detail__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 32, 0.4);
}

.detail__panel {
  position: relative;
  width: min(100%, var(--panel-width));
  height: 100%;
  background: var(--bg-elevated);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.22s ease;
  text-align: left;

  @include media-range('mobile', 'tablet') {
    width: 100%;
  }
}

@keyframes slideIn {
  from { transform: translateX(24px); opacity: 0.6; }
  to { transform: translateX(0); opacity: 1; }
}

.detail__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.detail__saved {
  font-size: 12px;
  color: var(--success);
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s ease;

  &.is-visible {
    opacity: 1;
  }
}

.detail__close {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: var(--bg-muted);
  color: var(--text);
  padding: 0;
}

.detail__body {
  overflow: auto;
  padding: 16px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail__title {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--border);
  border-radius: 0;
  font-size: 22px;
  font-weight: 700;
  padding: 8px 0;
  background: transparent;

  &:focus {
    box-shadow: none;
    border-color: var(--primary);
  }
}

.detail__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;

  input,
  textarea,
  select {
    font-weight: 400;
    color: var(--text);
  }
}

.detail__count {
  font-size: 12px;
  font-weight: 400;
}

.detail__priority {
  display: flex;
  gap: 6px;

  button {
    height: 32px;
    padding: 0 12px;
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
}

.detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;

  input {
    flex: 1;
    min-width: 120px;
  }
}

.detail__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;

  button {
    border: none;
    background: transparent;
    color: inherit;
    padding: 0;
    height: auto;
    opacity: 0.85;
  }
}
</style>
