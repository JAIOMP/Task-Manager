import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import TaskList from '../src/components/task/TaskList.vue';
import TaskCard from '../src/components/task/TaskCard.vue';

describe('TaskList.vue', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(TaskList, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskCard },
      },
    });

    expect(wrapper.find('.todo__task-list').exists()).toBe(true);
  });

  it('renders the correct number of TaskCard components based on store tasks', async () => {
    const wrapper = mount(TaskList, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            taskStore: {
              tasks: [
                { id: 1, title: 'Task 1', description: 'Description 1', dueDate: '2023-09-01', status: 'Pending' },
                { id: 2, title: 'Task 2', description: 'Description 2', dueDate: '2023-09-02', status: 'Completed' },
                { id: 3, title: 'Task 3', description: 'Description 3', dueDate: '2023-09-03', status: 'In Progress' },
              ],
            },
          },
        })],
        components: { TaskCard },
        provide: {
          'update-task': vi.fn(),
        },
      },
    });

    const taskCards = wrapper.findAllComponents(TaskCard);
    expect(taskCards.length).toBe(3);
  });

  it('passes the correct task props to each TaskCard', async () => {
    const wrapper = mount(TaskList, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            taskStore: {
              tasks: [
                { id: 1, title: 'Task 1', description: 'Description 1', dueDate: '2023-09-01', status: 'Pending' },
                { id: 2, title: 'Task 2', description: 'Description 2', dueDate: '2023-09-02', status: 'Completed' },
                { id: 3, title: 'Task 3', description: 'Description 3', dueDate: '2023-09-03', status: 'In Progress' },
              ],
            },
          },
        })],
        components: { TaskCard },
        provide: {
          'update-task': vi.fn(),
        },
      },
    });

    const taskCards = wrapper.findAllComponents(TaskCard);

    taskCards.forEach((taskCard, index) => {
      expect(taskCard.props('task')).toEqual({
        id: index + 1,
        title: `Task ${index + 1}`,
        description: `Description ${index + 1}`,
        dueDate: `2023-09-0${index + 1}`,
        status: index === 0 ? 'Pending' : index === 1 ? 'Completed' : 'In Progress',
      });
    });
  });
});
