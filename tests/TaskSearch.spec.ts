import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import SearchBar from '../src/components/task/TaskSearch.vue';
import { useTaskStore } from '../src/stores/taskStore';

describe('SearchBar.vue', () => {
  it('renders the search input with the correct placeholder', () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('placeholder')).toBe('Search tasks...');
  });

  it('updates searchQuery and calls store.setSearchQuery when typing', async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    const store = useTaskStore();

    const input = wrapper.find('input');
    await input.setValue('New Task Query');

    expect(store.setSearchQuery).toHaveBeenCalledWith('New Task Query');
    expect(wrapper.vm.searchQuery).toBe('New Task Query');
  });
});
