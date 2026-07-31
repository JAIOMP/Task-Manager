import type { Task } from '../types';

export const DEFAULT_TASK: Task = {
  id: '',
  title: '',
  description: '',
  completed: false,
  completedAt: null,
  createdAt: '',
  updatedAt: '',
  priority: null,
  dueDate: null,
  dueTime: null,
  tags: [],
  subtasks: [],
  listId: null,
  order: 0,
  reminderSet: false,
};

export const LIST_COLORS = [
  '#4A90E2',
  '#50E3C2',
  '#F5A623',
  '#D0021B',
  '#7B61FF',
  '#E91E63',
  '#009688',
  '#795548',
];
