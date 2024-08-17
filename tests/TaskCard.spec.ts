import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import TaskCard from '../src/components/TaskCard.vue';
import { useTaskStore } from '../src/stores/taskStore';
import { Task } from '../src/configs/types';
import { DEFAULT_TASK } from '../src/configs/constants';

describe('TaskCard.vue', () => {
  const task: Task = {
    ...DEFAULT_TASK,
    title: 'Test Task',
    description: 'This is a test task',
    dueDate: '2023-09-20',
    status: 'Pending',
  };

  it('renders task details correctly', () => {
    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.find('.todo__task-title').text()).toBe('Test Task');
    expect(wrapper.find('.todo__task-title-desc p').text()).toBe('This is a test task');
    expect(wrapper.find('.todo__task-date p').text()).toBe('2023-09-20');
    expect(wrapper.find('.todo__task-status').text()).toBe('Pending');
  });

  it('calls updateTask method when edit button is clicked', async () => {
    const mockHandleEvent = vi.fn()
    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createTestingPinia()],
        provide: {
          'update-task': mockHandleEvent,
        },
      },
    });

    await wrapper.find('.todo__task-footer img[alt="edit"]').trigger('click');

    expect(mockHandleEvent).toHaveBeenCalledWith(task, 'Update');
  });

  it('calls deleteTask method when delete button is clicked', async () => {
    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createTestingPinia()],
      },
    });

    const store = useTaskStore();

    await wrapper.find('.todo__task-footer img[alt="delete"]').trigger('click');

    expect(store.deleteTask).toHaveBeenCalledWith(task.id);
  });
});
