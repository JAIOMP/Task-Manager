<script setup lang="ts">
import { ref, withDefaults, defineProps } from 'vue';
import Checkbox from '../atoms/Checkbox.vue'
import { Status } from '../../configs/types';

const TASK_STATUS: Record<string, string> = {
  pending: 'Pending',
  inProgress: 'In progress',
  completed: 'Completed'
}

interface Props {
  taskStatus?: Status
  isFilter?: boolean
  setFilter?: Function
  updateStatus?: Function
}

const props = withDefaults(defineProps<Props>(), {
  taskStatus: null,
  isFilter: false,
  setFilter: () => {},
  updateStatus: () => {}
})


const selectedStatus = ref<Status>(props.taskStatus)

function updateStatus(status: Status, event?: Event): void {
  if (!props.isFilter) {
    selectedStatus.value = status
    props.updateStatus(status)
  } else {
    props.setFilter(event)
  }
}

</script>

<template>
  <div v-for="(label, status) in TASK_STATUS" :key="status" class="todo__task-status">
      <Checkbox
        :label="label"
        :value="label" 
        :checked="selectedStatus === label as Status" 
        :change="(event?: Event) => updateStatus(label as Status, event)" 
      />
  </div>
</template>
