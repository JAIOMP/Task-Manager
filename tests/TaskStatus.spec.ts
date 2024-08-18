import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TaskStatus from '../src/components/TaskStatus.vue';
import Checkbox from '../src/components/atoms/Checkbox.vue';
import { Status } from '../src/configs/types';

describe('TaskStatus.vue', () => {
  it('renders the correct number of checkboxes', () => {
    const wrapper = mount(TaskStatus, {
      global: {
        components: { Checkbox },
      },
    });

    
    const checkboxes = wrapper.findAllComponents(Checkbox);
    expect(checkboxes.length).toBe(3); 
  });

  it('updates the selected status and calls updateStatus when isFilter is false', async () => {
    const updateStatus = vi.fn();
    const wrapper = mount(TaskStatus, {
      props: {
        taskStatus: 'Pending' as Status,
        updateStatus,
      },
      global: {
        components: { Checkbox },
      },
    });

    
    const checkbox = wrapper.findAllComponents(Checkbox).at(1);
    
    await checkbox?.vm.change();

    
    expect(wrapper.vm.selectedStatus).toBe('In progress');
    expect(updateStatus).toHaveBeenCalledWith('In progress');
  });

  it('calls setFilter when isFilter is true', async () => {
    const setFilter = vi.fn();
    const wrapper = mount(TaskStatus, {
      props: {
        isFilter: true,
        setFilter,
      },
      global: {
        components: { Checkbox },
      },
    });

    
    const checkbox = wrapper.findAllComponents(Checkbox).at(0);
    await checkbox?.vm.change();

    
    expect(setFilter).toHaveBeenCalled();
  });
});
