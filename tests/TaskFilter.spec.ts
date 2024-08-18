import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TaskFilter from '../src/components/task/TaskFilter.vue';
import TaskStatus from '../src/components/task/TaskStatus.vue';
import Checkbox from '../src/components/atoms/Checkbox.vue';

describe('TaskFilter.vue', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(TaskFilter, {
      global: {
        components: {
          TaskStatus,
          Checkbox,
        },
      },
    });

    expect(wrapper.find('.todo__task-filter-status').exists()).toBe(true);
    expect(wrapper.find('.todo__task-filter-sort').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe('Select status:');
  });

  it('calls setFilters when TaskStatus is used', async () => {
    const setFilters = vi.fn();
    const wrapper = mount(TaskFilter, {
      props: {
        setFilters,
      },
      global: {
        components: {
          TaskStatus,
          Checkbox,
        },
      },
    });

    wrapper.findComponent(TaskStatus).vm.setFilter()

    expect(setFilters).toHaveBeenCalled();
  });
});
