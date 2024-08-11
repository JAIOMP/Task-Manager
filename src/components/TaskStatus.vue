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
}

const props = withDefaults(defineProps<Props>(), {
  taskStatus: 'Pending',
})


const selectedStatus = ref<Status>(props.taskStatus)

function updateStatus(status: Status) {
  selectedStatus.value = status
}

</script>

<template>
  <div v-for="(label, status) in TASK_STATUS" :key="status" class="todo__task-status">
      <Checkbox
        :label="label"
        :value="status" 
        :checked="selectedStatus === status as Status" 
        :change="() => updateStatus(status as Status)" 
      />
  </div>
</template>
