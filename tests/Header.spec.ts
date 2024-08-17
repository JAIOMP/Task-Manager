import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing'
import Header from '../src/components/Header.vue';
import { useTaskStore } from '../src/stores/taskStore'

describe('Header.vue', () => {
  it('renders the header title', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.find('.task-manager__header-title').text()).toBe('Task Manager');
  });

  it('opens the add task modal when button is clicked', async () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    const store = useTaskStore()

    await wrapper.find('.task-manager__header-button').trigger('click');

    expect(store.openAddTask).toBe(true);
  });
});
