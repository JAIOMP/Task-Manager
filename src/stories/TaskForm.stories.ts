// src/stories/TaskForm.stories.ts
import { ref } from 'vue';
import { defineComponent } from 'vue';
import { setActivePinia, createPinia } from 'pinia';
import TaskForm from '../components/TaskUpdateForm.vue'; // Update with your actual path
import { useTaskStore } from '../stores/taskStore';
import { Status } from '../configs/types';

export default {
  title: 'Components/TaskForm',
  component: TaskForm,
  argTypes: {
    modalTitle: { control: 'text', description: 'Title of the modal, e.g., "Add" or "Update"' },
    id: { control: 'number', description: 'The ID of the task, can be null for new tasks' },
    title: { control: 'text', description: 'The title of the task' },
    description: { control: 'text', description: 'The description of the task' },
    dueDate: { control: 'text', description: 'The due date of the task' },
    status: {
      control: {
        type: 'select',
        options: ['Pending', 'In Progress', 'Completed', 'Overdue'],
      },
      description: 'The status of the task',
    },
  },
};

const Template = (args) => {
  // Create a new Pinia instance and set it as the active store
  const pinia = createPinia();
  setActivePinia(pinia);

  // Use the task store
  const store = useTaskStore();

  // Optionally, populate the store with some initial tasks
  store.tasks = [
    {
      id: 1,
      title: 'Initial Task',
      description: 'This is an initial task in the store',
      dueDate: '2023-09-01',
      status: 'Pending' as Status,
    },
  ];

  // Use the provided arguments in the template
  return defineComponent({
    components: { TaskForm },
    setup() {
      return { args };
    },
    template: '<TaskForm v-bind="args" />',
  });
};

export const AddTask = Template.bind({});
AddTask.args = {
  id: null,
  title: '',
  description: '',
  dueDate: '',
  status: 'Pending',
  modalTitle: 'Add',
};

export const TaskUpdateForm = Template.bind({});
TaskUpdateForm.args = {
  id: 1,
  title: 'Updated Task',
  description: 'This is an updated task description',
  dueDate: '2023-09-15',
  status: 'In progress',
  modalTitle: 'Update',
};
