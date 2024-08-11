<script setup lang="ts">
import { ref, withDefaults, defineProps } from 'vue';
import Checkbox from './atoms/Checkbox.vue'

type Status = 'Pending' | 'In progress' | 'Completed';

const TASK_STATUS = {
  pending: 'Pending',
  inProgress: 'In progress',
  completed: 'Completed'
}

interface Props {
  taskStatus: Status
  isFilter: boolean
  setFilter: Function
}

const props = withDefaults(defineProps<Props>(), {
  taskStatus: 'Pending',
  isFilter: false,
  setFilter: () => {}
})


const selectedStatus = ref<Status>(props.taskStatus)

function updateStatus(status: Status, event: Event | undefined) {
  if (!props.isFilter) {
    selectedStatus.value = status
  } else {
    props.setFilter(event)
  }
}

</script>

<template>
  <div v-for="(label, status) in TASK_STATUS" :key="status" class="todo__task-status">
      <Checkbox
        :label="label"
        :value="status" 
        :checked="selectedStatus === status as Status" 
        :change="(event?: Event) => updateStatus(status as Status, event)" 
      />
  </div>
</template>
