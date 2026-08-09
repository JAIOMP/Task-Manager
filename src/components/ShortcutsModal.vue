<script setup lang="ts">
defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const shortcuts = [
  { key: 'N', action: 'Focus the new task input' },
  { key: 'Escape', action: 'Close detail panel / clear search / exit selection mode' },
  { key: '/', action: 'Focus the search input' },
  { key: 'D', action: 'Delete the currently focused task' },
  { key: 'E', action: 'Open detail panel for the focused task' },
  { key: 'Space', action: 'Toggle complete on the focused task' },
  { key: 'Ctrl+Z', action: 'Undo last action' },
  { key: '?', action: 'Show keyboard shortcuts' },
];
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal" role="dialog" aria-label="Keyboard shortcuts">
      <div class="modal__backdrop" @click="emit('close')" />
      <div class="modal__card" @click.stop>
        <header class="modal__header">
          <h2>Keyboard shortcuts</h2>
          <button type="button" aria-label="Close" @click="emit('close')">✕</button>
        </header>
        <table class="modal__table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in shortcuts" :key="row.key">
              <td><kbd>{{ row.key }}</kbd></td>
              <td>{{ row.action }}</td>
            </tr>
          </tbody>
        </table>
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
  width: min(92vw, 520px);
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
  margin-bottom: 16px;

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

.modal__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    text-align: left;
    padding: 10px 8px;
    border-bottom: 1px solid var(--border);
  }

  th {
    color: var(--text-muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  kbd {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 6px;
    background: var(--bg-muted);
    border: 1px solid var(--border);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    font-weight: 700;
  }
}
</style>
