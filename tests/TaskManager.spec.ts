import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import TaskManager from '../src/components/task/TaskManager.vue'; 
import TaskFilter from '../src/components/task/TaskFilter.vue';
import TaskList from '../src/components/task/TaskList.vue';
import TaskUpdateForm from '../src/components/task/TaskUpdateForm.vue';
import { Task } from '../src/configs/types';

describe('TaskManager.vue', () => {
  it('renders the component correctly with all child components', () => {
    const wrapper = mount(TaskManager, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskFilter, TaskList, TaskUpdateForm },
      },
    });

    expect(wrapper.findComponent(TaskFilter).exists()).toBe(true);
    expect(wrapper.findComponent(TaskList).exists()).toBe(true);
    expect(wrapper.findComponent(TaskUpdateForm).exists()).toBe(false); 
  });

  it('updates the task and shows the modal when TaskUpdateForm is called with a task', async () => {
    const wrapper = mount(TaskManager, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskFilter, TaskList, TaskUpdateForm },
      },
    });

    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'This is a test task',
      dueDate: '2023-09-20',
      status: 'Pending',
    };

    const { updateTask } = wrapper.vm as any;

    await updateTask(task);

    expect(wrapper.vm.updatedTask).toEqual({
      ...task,
      modalTitle: 'Update',
    });

    expect(wrapper.findComponent(TaskUpdateForm).exists()).toBe(true);
    expect(wrapper.findComponent(TaskUpdateForm).props('title')).toBe('Test Task');
  });

  it('resets the modal task and hides the modal when TaskUpdateForm is called without a task', async () => {
    const wrapper = mount(TaskManager, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskFilter, TaskList, TaskUpdateForm },
      },
    });

    const { updateTask } = wrapper.vm as any;

    
    updateTask(undefined);

    
    expect(wrapper.vm.updatedTask).toEqual({
      id: null,
      title: '',
      description: '',
      dueDate: '',
      status: 'Pending',
      modalTitle: 'Add',
    });

    
    expect(wrapper.findComponent(TaskUpdateForm).exists()).toBe(false);
  });
});
