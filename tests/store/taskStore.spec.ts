import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '../../src/stores/taskStore';
import { Task } from '../../src/configs/types';

describe('Task Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('adds a task correctly', () => {
    const store = useTaskStore();
    const task: Task = {
      id: 1,
      title: 'New Task',
      description: 'Task description',
      dueDate: '2023-09-15',
      status: 'Pending',
    };

    store.addTask(task);

    expect(store.initTasks).toHaveLength(1);
    expect(store.tasks).toHaveLength(1);
    expect(store.tasks[0]).toEqual(task);
  });

  it('updates a task correctly', () => {
    const store = useTaskStore();
    const task: Task = {
      id: 1,
      title: 'New Task',
      description: 'Task description',
      dueDate: '2023-09-15',
      status: 'Pending',
    };

    store.addTask(task);

    const updatedTask: Task = {
      ...task,
      title: 'Updated Task',
      status: 'Completed',
    };

    store.updateTask(updatedTask);

    expect(store.initTasks[0].title).toBe('Updated Task');
    expect(store.initTasks[0].status).toBe('Completed');
    expect(store.tasks[0].title).toBe('Updated Task');
    expect(store.tasks[0].status).toBe('Completed');
  });

  it('deletes a task correctly', () => {
    const store = useTaskStore();
    const task: Task = {
      id: 1,
      title: 'New Task',
      description: 'Task description',
      dueDate: '2023-09-15',
      status: 'Pending',
    };

    store.addTask(task);
    expect(store.initTasks).toHaveLength(1);

    store.deleteTask(task.id);
    expect(store.initTasks).toHaveLength(0);
    expect(store.tasks).toHaveLength(0);
  });

  it('sets filters correctly', () => {
    const store = useTaskStore();

    const task1: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: '2023-09-15',
      status: 'Pending',
    };

    const task2: Task = {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      dueDate: '2023-09-16',
      status: 'Completed',
    };

    store.addTask(task1);
    store.addTask(task2);

    const event = {
      target: {
        checked: true,
        value: 'Pending',
      },
    } as unknown as Event;

    store.setFilters(event);

    expect(store.filters).toEqual({ Pending: true });
    expect(store.tasks).toHaveLength(1);
    expect(store.tasks[0].status).toBe('Pending');
  });

  it('sorts tasks by due date correctly', () => {
    const store = useTaskStore();

    const task1: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: '2023-09-16',
      status: 'Pending',
    };

    const task2: Task = {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      dueDate: '2023-09-15',
      status: 'Completed',
    };

    store.addTask(task1);
    store.addTask(task2);

    const event = {
      target: {
        checked: true,
      },
    } as unknown as Event;

    store.sortTasks(event);

    expect(store.tasks[0].dueDate).toBe('2023-09-15');
    expect(store.tasks[1].dueDate).toBe('2023-09-16');
  });

  it('set filters when sort by due date is unchecked', () => {
    const store = useTaskStore();

    const filterEvent = {
      target: {
        checked: true,
        value: 'Pending',
      },
    } as unknown as Event;

    store.setFilters(filterEvent);

    const task1: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: '2023-09-16',
      status: 'Pending',
    };

    const task2: Task = {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      dueDate: '2023-09-15',
      status: 'Completed',
    };

    store.addTask(task1);
    store.addTask(task2);

    const event = {
      target: {
        checked: false,
      },
    } as unknown as Event;

    store.sortTasks(event);

    expect(store.tasks).toHaveLength(1);
  });
});
