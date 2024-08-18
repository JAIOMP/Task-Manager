import { createPinia, setActivePinia } from 'pinia';
import TaskList from '../components/task/TaskList.vue';
import { useTaskStore } from '../stores/taskStore';

export default {
  title: 'Components/TaskList',
  component: TaskList,
};

const Template = (args) => {
  const pinia = createPinia();
  setActivePinia(pinia);

  const store = useTaskStore();
  store.tasks = args.tasks;

  return {
    components: { TaskList },
    setup() {
      return { args };
    },
    template: '<TaskList />',
  };
};

export const Default = Template.bind({});
Default.args = {
  tasks: [
    {
      id: 1,
      title: 'Task 1',
      description: 'This is the first task.',
      dueDate: '2023-09-01',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'This is the second task.',
      dueDate: '2023-09-10',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'This is the third task.',
      dueDate: '2023-09-15',
      status: 'Completed',
    },
  ],
};
