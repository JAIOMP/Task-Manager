import { ref } from 'vue';

export type UndoAction = {
  label: string;
  undo: () => void;
};

const stack = ref<UndoAction[]>([]);
const MAX = 10;

const toastMessage = ref<string | null>(null);
const toastUndo = ref<(() => void) | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function useUndoStack() {
  function push(action: UndoAction, toastLabel?: string) {
    stack.value = [...stack.value.slice(-(MAX - 1)), action];
    showToast(toastLabel ?? `${action.label} · Undo`, action.undo);
  }

  function undo() {
    const action = stack.value.pop();
    if (!action) return;
    stack.value = [...stack.value];
    action.undo();
    dismissToast();
  }

  function showToast(message: string, onUndo?: () => void) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.value = message;
    toastUndo.value = onUndo
      ? () => {
          onUndo();
          // Remove matching top action if present
          dismissToast();
        }
      : null;
    toastTimer = setTimeout(() => {
      dismissToast();
    }, 5000);
  }

  function dismissToast() {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = null;
    toastMessage.value = null;
    toastUndo.value = null;
  }

  function triggerToastUndo() {
    if (toastUndo.value) {
      // Prefer stack undo if available
      if (stack.value.length) {
        undo();
      } else {
        toastUndo.value();
        dismissToast();
      }
    }
  }

  return {
    stack,
    toastMessage,
    toastUndo,
    push,
    undo,
    showToast,
    dismissToast,
    triggerToastUndo,
  };
}
