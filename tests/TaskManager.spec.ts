import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import TaskManager from '../src/components/TaskManager.vue'; 
import TaskFilter from '../src/components/TaskFilter.vue';
import TaskList from '../src/components/TaskList.vue';
import UpdateTask from '../src/components/UpdateTask.vue';
import { Task } from '../src/configs/types';

describe('TaskManager.vue', () => {
  it('renders the component correctly with all child components', () => {
    const wrapper = mount(TaskManager, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskFilter, TaskList, UpdateTask },
      },
    });

    expect(wrapper.findComponent(TaskFilter).exists()).toBe(true);
    expect(wrapper.findComponent(TaskList).exists()).toBe(true);
    expect(wrapper.findComponent(UpdateTask).exists()).toBe(false); 
  });

  it('updates the task and shows the modal when updateTask is called with a task', async () => {
    const wrapper = mount(TaskManager, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskFilter, TaskList, UpdateTask },
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

    expect(wrapper.findComponent(UpdateTask).exists()).toBe(true);
    expect(wrapper.findComponent(UpdateTask).props('title')).toBe('Test Task');
  });

  it('resets the modal task and hides the modal when updateTask is called without a task', async () => {
    const wrapper = mount(TaskManager, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskFilter, TaskList, UpdateTask },
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

    
    expect(wrapper.findComponent(UpdateTask).exists()).toBe(false);
  });
});
