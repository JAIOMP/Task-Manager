import { mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TaskUpdateForm from '../src/components/TaskUpdateForm.vue'; 
import TaskInput from '../src/components/atoms/Input.vue';
import TaskButton from '../src/components/atoms/Button.vue';
import TaskStatus from '../src/components/TaskStatus.vue';
import { createTestingPinia } from '@pinia/testing';
import { useTaskStore } from '../src/stores/taskStore';


describe('TaskUpdateForm.vue', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(TaskUpdateForm, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskInput, TaskButton, TaskStatus },
        provide: {
          'update-task': vi.fn(),
        },
      },
      props: {
        modalTitle: 'Add',
      },
    });

    expect(wrapper.find('.todo__task-update-form').exists()).toBe(true);
    expect(wrapper.findComponent(TaskInput).exists()).toBe(true);
    expect(wrapper.findComponent(TaskButton).exists()).toBe(true);
    expect(wrapper.findComponent(TaskStatus).exists()).toBe(true);
  });

  it('handles form submission correctly', async () => {
    const wrapper = mount(TaskUpdateForm, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })],
        components: { TaskInput, TaskButton, TaskStatus },
        provide: {
          'update-task': vi.fn(),
        },
      },
      props: {
        modalTitle: 'Add',
      },
    });
    const store = useTaskStore();
    
    await wrapper.find('#title').setValue('New Task');
    await wrapper.find('#description').setValue('Task description');
    await wrapper.find('#dueDate').setValue('2023-09-15');

    
    await wrapper.find('form').trigger('submit.prevent');

    expect(store.addTask).toHaveBeenCalledWith({
      id: expect.any(Number),
      title: 'New Task',
      description: 'Task description',
      status: 'Pending',
      dueDate: '2023-09-15',
    });

    
    expect(wrapper.find('#title').element.value).toBe('');
    expect(wrapper.find('#description').element.value).toBe('');
    expect(wrapper.find('#dueDate').element.value).toBe('');
  });

  it('closes the modal when close button is clicked', async () => {
    const wrapper = mount(TaskUpdateForm, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskInput, TaskButton, TaskStatus },
        provide: {
          'update-task': vi.fn(),
        },
      },
      props: {
        modalTitle: 'Add',
      },
    });

    const store = useTaskStore();

    await wrapper.find('.todo__task-form-close-btn').trigger('click');

    expect(store.openAddTask).toBe(false);
  });

  it('updates the task status when TaskStatus emits a status change', async () => {
    const wrapper = mount(TaskUpdateForm, {
      global: {
        plugins: [createTestingPinia()],
        components: { TaskInput, TaskButton, TaskStatus },
        provide: {
          'update-task': vi.fn(),
        },
      },
      props: {
        modalTitle: 'Add',
        status: 'Pending',
      },
    });

    const taskStatusComponent = wrapper.findComponent(TaskStatus);
    await taskStatusComponent.vm.updateStatus('InProgress');

    expect(wrapper.vm.task.status).toBe('InProgress');
  });
});
