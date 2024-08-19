import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "../../src/stores/taskStore";
import { Task } from "../../src/configs/types";

describe("Task Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("adds a task correctly", () => {
    const store = useTaskStore();
    const task: Task = {
      id: 1,
      title: "New Task",
      description: "Task description",
      dueDate: "2023-09-15",
      status: "Pending",
    };

    store.addTask(task);

    expect(store.initTasks).toHaveLength(1);
    expect(store.tasks).toHaveLength(1);
    expect(store.tasks[0]).toEqual(task);
  });

  it("updates a task correctly", () => {
    const store = useTaskStore();
    const task: Task = {
      id: 1,
      title: "New Task",
      description: "Task description",
      dueDate: "2023-09-15",
      status: "Pending",
    };

    store.addTask(task);

    const updatedTask: Task = {
      ...task,
      title: "Updated Task",
      status: "Completed",
    };

    store.updateTask(updatedTask);

    expect(store.initTasks[0].title).toBe("Updated Task");
    expect(store.initTasks[0].status).toBe("Completed");
    expect(store.tasks[0].title).toBe("Updated Task");
    expect(store.tasks[0].status).toBe("Completed");
  });

  it("deletes a task correctly", () => {
    const store = useTaskStore();
    const task: Task = {
      id: 1,
      title: "New Task",
      description: "Task description",
      dueDate: "2023-09-15",
      status: "Pending",
    };

    store.addTask(task);
    expect(store.initTasks).toHaveLength(1);

    store.deleteTask(task.id);
    expect(store.initTasks).toHaveLength(0);
    expect(store.tasks).toHaveLength(0);
  });

  it("sets filters correctly", () => {
    const store = useTaskStore();

    const task1: Task = {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      dueDate: "2023-09-15",
      status: "Pending",
    };

    const task2: Task = {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      dueDate: "2023-09-16",
      status: "Completed",
    };

    store.addTask(task1);
    store.addTask(task2);

    const event = {
      target: {
        checked: true,
        value: "Pending",
      },
    } as unknown as Event;

    store.setFilters(event);

    expect(store.filters).toEqual({ Pending: true });
    expect(store.tasks).toHaveLength(1);
    expect(store.tasks[0].status).toBe("Pending");
  });

  it("sorts tasks by due date correctly", () => {
    const store = useTaskStore();

    const task1: Task = {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      dueDate: "2023-09-16",
      status: "Pending",
    };

    const task2: Task = {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      dueDate: "2023-09-15",
      status: "Completed",
    };

    store.addTask(task1);
    store.addTask(task2);

    const event = {
      target: {
        checked: true,
      },
    } as unknown as Event;

    store.sortTasks(event);

    expect(store.tasks[0].dueDate).toBe("2023-09-15");
    expect(store.tasks[1].dueDate).toBe("2023-09-16");
  });

  it("set filters when sort by due date is unchecked", () => {
    const store = useTaskStore();

    const filterEvent = {
      target: {
        checked: true,
        value: "Pending",
      },
    } as unknown as Event;

    store.setFilters(filterEvent);

    const task1: Task = {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      dueDate: "2023-09-16",
      status: "Pending",
    };

    const task2: Task = {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      dueDate: "2023-09-15",
      status: "Completed",
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

  describe("Task Store - setSearchQuery and applyFiltersAndSearch", () => {
    let store;
    beforeEach(() => {
      store = useTaskStore();
      const tasks = [
        {
          id: 1,
          title: "First Task",
          description: "This is the first task description",
          dueDate: "2023-09-01",
          status: "Pending",
        },
        {
          id: 2,
          title: "Second Task",
          description: "This is the second task description",
          dueDate: "2023-09-02",
          status: "Completed",
        },
        {
          id: 3,
          title: "Third Task",
          description: "This is the third task description",
          dueDate: "2023-09-03",
          status: "In Progress",
        },
      ];

      store.addTask(tasks[0]);
      store.addTask(tasks[1]);
      store.addTask(tasks[2]);
    });

    it("should update the search query and filter tasks by title or description", () => {
      store.setSearchQuery("first");
      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toBe("First Task");

      store.setSearchQuery("task");
      expect(store.tasks).toHaveLength(3);

      store.setSearchQuery("second");
      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toBe("Second Task");
    });

    it("should filter tasks by status before applying the search query", () => {
      store.filters = { Completed: true };
      store.applyFiltersAndSearch();

      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].status).toBe("Completed");

      store.setSearchQuery("third");
      expect(store.tasks).toHaveLength(0);
    });

    it("should return all tasks if no filters and search query are applied", () => {
      store.setSearchQuery("");
      expect(store.tasks).toHaveLength(3);
    });

    it("should return tasks filtered by search query case-insensitively", () => {
      store.setSearchQuery("FIRST");
      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toBe("First Task");

      store.setSearchQuery("DESCRIPTION");
      expect(store.tasks).toHaveLength(3);
    });

    it("should handle an empty search query by returning all tasks after filters are applied", () => {
      store.setSearchQuery("first");
      expect(store.tasks).toHaveLength(1);

      store.setSearchQuery("");
      expect(store.tasks).toHaveLength(3);
    });

    it("should combine filters and search query to narrow down tasks", () => {
      store.filters = { "In Progress": true };
      store.setSearchQuery("third");

      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toBe("Third Task");

      store.setSearchQuery("first");
      expect(store.tasks).toHaveLength(0);
    });
  });
});
