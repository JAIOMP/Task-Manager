<script setup lang="ts">
import { ref } from 'vue';
import { useLists } from '@/composables/useLists';
import { useTasks } from '@/composables/useTasks';
import {
  exportTasksCSV,
  exportTasksJSON,
  readImportFile,
  type ParsedImport,
} from '@/utils/export';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const { tasks, replaceAllTasks, mergeImportedTasks } = useTasks();
const { lists, replaceAllLists, mergeImportedLists } = useLists();

const importMode = ref<'replace' | 'merge'>('replace');
const fileInput = ref<HTMLInputElement | null>(null);
const error = ref('');
const importing = ref(false);

function exportJSON() {
  exportTasksJSON(tasks.value, lists.value);
  emit('close');
}

function exportCSV() {
  exportTasksCSV(tasks.value);
  emit('close');
}

function pickFile() {
  error.value = '';
  fileInput.value?.click();
}

function applyImport(parsed: ParsedImport) {
  if (importMode.value === 'replace') {
    replaceAllTasks(parsed.tasks);
    if (parsed.lists.length || parsed.format === 'backup') {
      replaceAllLists(parsed.lists);
    }
  } else {
    mergeImportedTasks(parsed.tasks);
    if (parsed.lists.length) {
      mergeImportedLists(parsed.lists);
    }
  }
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  importing.value = true;
  error.value = '';
  try {
    const parsed = await readImportFile(file);
    applyImport(parsed);
    emit('close');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not import that file.';
  } finally {
    importing.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal" role="dialog" aria-label="Export and import">
      <div class="modal__backdrop" @click="emit('close')" />
      <div class="modal__card" @click.stop>
        <header class="modal__header">
          <h2>Export / import</h2>
          <button type="button" aria-label="Close" @click="emit('close')">✕</button>
        </header>

        <section class="modal__section">
          <h3>Export</h3>
          <p class="modal__hint">
            Download a backup for another device. JSON includes tasks and lists.
          </p>
          <div class="modal__actions">
            <button type="button" class="modal__btn" @click="exportJSON">
              Export as JSON
            </button>
            <button type="button" class="modal__btn modal__btn--ghost" @click="exportCSV">
              Export as CSV
            </button>
          </div>
        </section>

        <section class="modal__section">
          <h3>Import</h3>
          <p class="modal__hint">
            Choose a Todolo JSON backup or CSV export from another device.
          </p>

          <div class="modal__modes" role="radiogroup" aria-label="Import mode">
            <label class="modal__mode">
              <input v-model="importMode" type="radio" value="replace" />
              Replace all
            </label>
            <label class="modal__mode">
              <input v-model="importMode" type="radio" value="merge" />
              Merge by id
            </label>
          </div>

          <input
            ref="fileInput"
            class="sr-only"
            type="file"
            accept=".json,.csv,application/json,text/csv"
            @change="onFileChange"
          />

          <button
            type="button"
            class="modal__btn"
            :disabled="importing"
            @click="pickFile"
          >
            {{ importing ? 'Importing…' : 'Choose file' }}
          </button>

          <p v-if="error" class="modal__error">{{ error }}</p>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 32, 0.45);
}

.modal__card {
  position: relative;
  width: min(92vw, 440px);
  background: var(--bg-elevated);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 20px;
  text-align: left;
  max-height: 90vh;
  overflow: auto;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  button {
    border: none;
    background: var(--bg-muted);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: var(--text);
    padding: 0;
  }
}

.modal__section {
  padding: 12px 0;

  & + & {
    border-top: 1px solid var(--border);
  }

  h3 {
    margin: 0 0 6px;
    font-size: 14px;
    color: var(--text);
  }
}

.modal__hint {
  margin: 0 0 12px;
  color: var(--text-muted);
  font-size: 14px;
}

.modal__modes {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.modal__mode {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text);
  font-weight: 600;
}

.modal__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal__btn {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }

  &--ghost {
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);

    &:hover:not(:disabled) {
      background: var(--bg-muted);
    }
  }
}

.modal__error {
  margin: 10px 0 0;
  color: var(--danger);
  font-size: 13px;
}
</style>
