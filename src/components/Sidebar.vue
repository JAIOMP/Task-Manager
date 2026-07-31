<script setup lang="ts">
import { ref } from 'vue';
import { LIST_COLORS } from '@/configs/constants';
import { useLists } from '@/composables/useLists';
import { usePrefs } from '@/composables/usePrefs';
import { useTasks } from '@/composables/useTasks';

const { lists, addList, deleteList } = useLists();
const { activeListId, sidebarCollapsed, setActiveListId, setSidebarCollapsed } = usePrefs();
const { uncategorizeListTasks } = useTasks();

const showCreate = ref(false);
const newName = ref('');
const newColor = ref(LIST_COLORS[0]);
const menuOpenId = ref<string | null>(null);

function selectAll() {
  setActiveListId(null);
}

function selectList(id: string) {
  setActiveListId(id);
  menuOpenId.value = null;
}

function createList() {
  if (!newName.value.trim()) return;
  const list = addList(newName.value, newColor.value);
  newName.value = '';
  newColor.value = LIST_COLORS[0];
  showCreate.value = false;
  setActiveListId(list.id);
}

function removeList(id: string) {
  uncategorizeListTasks(id);
  deleteList(id);
  if (activeListId.value === id) setActiveListId(null);
  menuOpenId.value = null;
}

function onContextMenu(e: MouseEvent, id: string) {
  e.preventDefault();
  menuOpenId.value = id;
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-collapsed': sidebarCollapsed }">
    <div class="sidebar__header">
      <button
        type="button"
        class="sidebar__toggle"
        :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="setSidebarCollapsed(!sidebarCollapsed)"
      >
        {{ sidebarCollapsed ? '»' : '«' }}
      </button>
      <span v-if="!sidebarCollapsed" class="sidebar__title">Lists</span>
    </div>

    <nav v-show="!sidebarCollapsed" class="sidebar__nav">
      <button
        type="button"
        class="sidebar__item"
        :class="{ 'is-active': activeListId === null }"
        @click="selectAll"
      >
        All tasks
      </button>

      <div
        v-for="list in lists"
        :key="list.id"
        class="sidebar__list-row"
        @contextmenu="onContextMenu($event, list.id)"
      >
        <button
          type="button"
          class="sidebar__item"
          :class="{ 'is-active': activeListId === list.id }"
          @click="selectList(list.id)"
        >
          <span class="sidebar__dot" :style="{ background: list.color }" />
          {{ list.name }}
        </button>
        <button
          type="button"
          class="sidebar__more"
          aria-label="List options"
          @click.stop="menuOpenId = menuOpenId === list.id ? null : list.id"
        >
          …
        </button>
        <div v-if="menuOpenId === list.id" class="sidebar__menu">
          <button type="button" @click="removeList(list.id)">Delete list</button>
        </div>
      </div>

      <div class="sidebar__create">
        <button
          v-if="!showCreate"
          type="button"
          class="sidebar__add"
          @click="showCreate = true"
        >
          + New list
        </button>
        <form v-else class="sidebar__form" @submit.prevent="createList">
          <input v-model="newName" type="text" placeholder="List name" required />
          <div class="sidebar__colors">
            <button
              v-for="color in LIST_COLORS"
              :key="color"
              type="button"
              class="sidebar__color"
              :class="{ 'is-selected': newColor === color }"
              :style="{ background: color }"
              :aria-label="`Color ${color}`"
              @click="newColor = color"
            />
          </div>
          <div class="sidebar__form-actions">
            <button type="submit">Add</button>
            <button type="button" class="is-ghost" @click="showCreate = false">Cancel</button>
          </div>
        </form>
      </div>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
@import '@/assets/styles/media-queries';

.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border);
  padding: 16px 12px;
  transition: width 0.2s ease;
  text-align: left;

  &.is-collapsed {
    width: 56px;
  }

  @include media-range('mobile', 'desktop') {
    position: fixed;
    z-index: 40;
    left: 0;
    top: 0;
    bottom: 0;
    box-shadow: var(--shadow);

    &.is-collapsed {
      width: 0;
      padding: 0;
      border: none;
      overflow: hidden;
    }
  }
}

.sidebar__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.sidebar__toggle {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  padding: 0;
}

.sidebar__title {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--text);
  padding: 10px 12px;
  height: auto;
  border-radius: 8px;
  font-weight: 500;

  &:hover {
    background: var(--bg-muted);
  }

  &.is-active {
    background: var(--bg-muted);
    color: var(--primary);
    font-weight: 700;
  }
}

.sidebar__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sidebar__list-row {
  position: relative;
  display: flex;
  align-items: center;

  .sidebar__item {
    flex: 1;
  }
}

.sidebar__more {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 6px;

  &:hover {
    background: var(--bg-muted);
  }
}

.sidebar__menu {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 5;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 4px;
  min-width: 120px;

  button {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    color: var(--danger);
    padding: 8px 10px;
    height: auto;
    border-radius: 6px;
    font-weight: 600;

    &:hover {
      background: var(--bg-muted);
    }
  }
}

.sidebar__create {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.sidebar__add {
  width: 100%;
  background: transparent;
  border: 1px dashed var(--border);
  color: var(--text-muted);
  height: auto;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;

  &:hover {
    color: var(--primary);
    border-color: var(--primary);
  }
}

.sidebar__form {
  display: flex;
  flex-direction: column;
  gap: 8px;

  input {
    width: 100%;
  }
}

.sidebar__colors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sidebar__color {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  padding: 0;

  &.is-selected {
    border-color: var(--text);
  }
}

.sidebar__form-actions {
  display: flex;
  gap: 8px;

  button {
    flex: 1;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: var(--primary);
    color: #fff;
    font-weight: 600;

    &.is-ghost {
      background: var(--bg-muted);
      color: var(--text);
    }
  }
}
</style>
