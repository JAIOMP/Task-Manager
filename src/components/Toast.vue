<script setup lang="ts">
import { computed } from 'vue';
import { useUndoStack } from '@/composables/useUndoStack';

const { toastMessage, triggerToastUndo, dismissToast } = useUndoStack();

const visible = computed(() => !!toastMessage.value);

const showUndo = computed(() => {
  const msg = toastMessage.value ?? '';
  return msg.includes('Undo');
});

const label = computed(() => {
  const msg = toastMessage.value ?? '';
  return msg.replace(/\s*·\s*Undo\s*$/i, '').trim() || msg;
});
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" role="status">
      <span>{{ label }}</span>
      <button v-if="showUndo" type="button" class="toast__undo" @click="triggerToastUndo">
        Undo
      </button>
      <button type="button" class="toast__close" aria-label="Dismiss" @click="dismissToast">
        ✕
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--toast-bg);
  color: var(--toast-text);
  box-shadow: var(--shadow);
  font-size: 14px;
  max-width: min(90vw, 420px);
}

.toast__undo {
  background: transparent;
  border: none;
  color: var(--primary);
  font-weight: 700;
  padding: 0;
  height: auto;
  text-decoration: underline;
}

.toast__close {
  background: transparent;
  border: none;
  color: var(--toast-text);
  opacity: 0.7;
  padding: 0 4px;
  height: auto;
  font-size: 12px;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
