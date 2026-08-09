<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Priority } from '@/configs/types';
import { useLists } from '@/composables/useLists';
import { useTasks } from '@/composables/useTasks';

const {
  selectionMode,
  selectedIds,
  bulkComplete,
  bulkDelete,
  bulkSetPriority,
  bulkAssignList,
  exitSelectionMode,
} = useTasks();
const { lists } = useLists();

const showPriority = ref(false);
const showLists = ref(false);

const count = computed(() => selectedIds.value.size);
const visible = computed(() => selectionMode.value && count.value >= 0);

function setPriority(p: Priority) {
  bulkSetPriority(p);
  showPriority.value = false;
}

function assignList(id: string | null) {
  bulkAssignList(id);
  showLists.value = false;
}
</script>

<template>
  <Transition name="bulk">
    <div v-if="visible" class="bulk-bar">
      <span class="bulk-bar__count">{{ count }} selected</span>
      <div class="bulk-bar__actions">
        <button type="button" @click="bulkComplete(true)">Mark complete</button>
        <button type="button" @click="bulkComplete(false)">Mark incomplete</button>
        <button type="button" class="is-danger" @click="bulkDelete">Delete</button>

        <div class="bulk-bar__menu">
          <button type="button" @click="showPriority = !showPriority; showLists = false">
            Set priority
          </button>
          <div v-if="showPriority" class="bulk-bar__dropdown">
            <button type="button" @click="setPriority('high')">High</button>
            <button type="button" @click="setPriority('medium')">Medium</button>
            <button type="button" @click="setPriority('low')">Low</button>
            <button type="button" @click="setPriority(null)">None</button>
          </div>
        </div>

        <div class="bulk-bar__menu">
          <button type="button" @click="showLists = !showLists; showPriority = false">
            Assign to list
          </button>
          <div v-if="showLists" class="bulk-bar__dropdown">
            <button type="button" @click="assignList(null)">Uncategorized</button>
            <button
              v-for="list in lists"
              :key="list.id"
              type="button"
              @click="assignList(list.id)"
            >
              {{ list.name }}
            </button>
          </div>
        </div>

        <button type="button" class="is-ghost" @click="exitSelectionMode">Done</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.bulk-bar {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
  max-width: min(96vw, 920px);
}

.bulk-bar__count {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  white-space: nowrap;
}

.bulk-bar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;

  > button,
  .bulk-bar__menu > button {
    height: 34px;
    padding: 0 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-weight: 600;
    font-size: 13px;

    &.is-danger {
      color: var(--danger);
      border-color: var(--danger);
    }

    &.is-ghost {
      background: transparent;
    }
  }
}

.bulk-bar__menu {
  position: relative;
}

.bulk-bar__dropdown {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  min-width: 140px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 4px;
  display: flex;
  flex-direction: column;

  button {
    text-align: left;
    border: none;
    background: transparent;
    color: var(--text);
    height: auto;
    padding: 8px 10px;
    border-radius: 6px;
    font-weight: 500;

    &:hover {
      background: var(--bg-muted);
    }
  }
}

.bulk-enter-active,
.bulk-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.bulk-enter-from,
.bulk-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}
</style>
