<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import BulkActionBar from '@/components/BulkActionBar.vue';
import ExportModal from '@/components/ExportModal.vue';
import FilterBar from '@/components/FilterBar.vue';
import ShortcutsModal from '@/components/ShortcutsModal.vue';
import Sidebar from '@/components/Sidebar.vue';
import StatsBar from '@/components/StatsBar.vue';
import TaskCreateInput from '@/components/TaskCreateInput.vue';
import TaskDetailPanel from '@/components/TaskDetailPanel.vue';
import TaskList from '@/components/TaskList.vue';
import Toast from '@/components/Toast.vue';
import Toolbar from '@/components/Toolbar.vue';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';
import { usePrefs } from '@/composables/usePrefs';
import { useTasks } from '@/composables/useTasks';

const showExport = ref(false);
const showShortcuts = ref(false);
const createRef = ref<InstanceType<typeof TaskCreateInput> | null>(null);
const toolbarRef = ref<InstanceType<typeof Toolbar> | null>(null);

const { selectionMode, exitSelectionMode } = useTasks();
const { sidebarCollapsed, setSidebarCollapsed } = usePrefs();

useKeyboardShortcuts({
  getNewTaskInput: () => createRef.value?.inputEl ?? null,
  getSearchInput: () => toolbarRef.value?.searchEl ?? null,
  showShortcuts,
});

function onDocumentClick(e: MouseEvent) {
  if (!selectionMode.value) return;
  const target = e.target as HTMLElement;
  if (target.closest('.bulk-bar, .toolbar, .task-row')) return;
  exitSelectionMode();
}

onMounted(() => {
  document.title = 'Todolo';
  document.addEventListener('click', onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>

<template>
  <div class="app-shell">
    <button
      v-if="sidebarCollapsed"
      type="button"
      class="app-shell__menu"
      aria-label="Open lists"
      @click="setSidebarCollapsed(false)"
    >
      ☰
    </button>

    <Sidebar />

    <main class="app-shell__main">
      <Toolbar ref="toolbarRef" @open-export="showExport = true" />
      <StatsBar />
      <FilterBar />
      <TaskCreateInput ref="createRef" />
      <TaskList />
    </main>

    <TaskDetailPanel />
    <BulkActionBar />
    <Toast />
    <ExportModal :open="showExport" @close="showExport = false" />
    <ShortcutsModal :open="showShortcuts" @close="showShortcuts = false" />
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/main.scss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  text-align: left;
}

.app-shell {
  display: flex;
  min-height: 100%;
  background: var(--bg);
  color: var(--text);
}

.app-shell__main {
  flex: 1;
  min-width: 0;
  padding: 16px 24px 32px;
  max-width: 960px;
}

.app-shell__menu {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 50;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  padding: 0;
  box-shadow: var(--shadow);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
