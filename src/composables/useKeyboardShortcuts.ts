import { onMounted, onUnmounted, type Ref } from 'vue';
import { useTasks } from './useTasks';
import { useUndoStack } from './useUndoStack';

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
}

type MaybeEl = Ref<HTMLInputElement | null | undefined> | { value: HTMLInputElement | null | undefined };

export function useKeyboardShortcuts(options: {
  getNewTaskInput: () => HTMLInputElement | null | undefined;
  getSearchInput: () => HTMLInputElement | null | undefined;
  showShortcuts: Ref<boolean>;
}) {
  const {
    focusedTaskId,
    detailTaskId,
    selectionMode,
    searchQuery,
    openDetail,
    closeDetail,
    deleteTask,
    toggleComplete,
    clearSearch,
    exitSelectionMode,
  } = useTasks();
  const { undo } = useUndoStack();

  function onKeydown(e: KeyboardEvent) {
    const typing = isTypingTarget(e.target);

    if (e.key === '?' && !typing) {
      e.preventDefault();
      options.showShortcuts.value = true;
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      if (!typing) {
        e.preventDefault();
        undo();
      }
      return;
    }

    if (e.key === 'Escape') {
      if (options.showShortcuts.value) {
        options.showShortcuts.value = false;
        return;
      }
      if (detailTaskId.value) {
        closeDetail();
        return;
      }
      if (selectionMode.value) {
        exitSelectionMode();
        return;
      }
      if (searchQuery.value) {
        clearSearch();
        return;
      }
      return;
    }

    if (typing) return;

    switch (e.key.toLowerCase()) {
      case 'n':
        e.preventDefault();
        options.getNewTaskInput()?.focus();
        break;
      case '/':
        e.preventDefault();
        options.getSearchInput()?.focus();
        break;
      case 'e':
        if (focusedTaskId.value) {
          e.preventDefault();
          openDetail(focusedTaskId.value);
        }
        break;
      case 'd':
        if (focusedTaskId.value) {
          e.preventDefault();
          deleteTask(focusedTaskId.value);
        }
        break;
      case ' ':
        if (focusedTaskId.value) {
          e.preventDefault();
          toggleComplete(focusedTaskId.value);
        }
        break;
      default:
        break;
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => window.removeEventListener('keydown', onKeydown));
}

export type { MaybeEl };
