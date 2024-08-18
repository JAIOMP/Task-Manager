// src/stories/TaskCard.stories.ts
import TaskCard from '../components/task/TaskCard.vue';
import { Task } from '../configs/types';
import { DEFAULT_TASK } from '../configs/constants';

export default {
  title: 'Components/TaskCard',
  component: TaskCard,
  argTypes: {
    task: {
      control: 'object',
      description: 'The task object containing all task details such as title, description, dueDate, and status.',
    },
    'update-task': {
      action: 'update-task',
      description: 'Event emitted when the task is updated.',
    },
    'delete-task': {
      action: 'delete-task',
      description: 'Event emitted when the task is deleted.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'This component represents a task card that displays task details such as title, description, due date, and status. It also provides actions to update or delete the task.',
      },
    },
  },
};

const Template = (args: any) => ({
  components: { TaskCard },
  setup() {
    return { args };
  },
  template: '<TaskCard v-bind="args" />',
});

export const CompletedTask = Template.bind({});
CompletedTask.args = {
  task: {
    ...DEFAULT_TASK,
    title: 'Completed Task',
    description: 'This task has been completed.',
    dueDate: '2023-08-15',
    status: 'Completed',
  },
};

export const PendingTask = Template.bind({});
PendingTask.args = {
  task: {
    ...DEFAULT_TASK,
    title: 'Pending Task',
    description: 'This task is pending.',
    dueDate: '2023-07-01',
    status: 'Pending',
  },
};

export const InProgressTask = Template.bind({});
InProgressTask.args = {
  task: {
    ...DEFAULT_TASK,
    title: 'In progress Task',
    description: 'This task is in progress.',
    dueDate: '2023-07-01',
    status: 'In Progress',
  },
};
