<script setup lang="ts">
import { ref } from 'vue';

interface TaskStatus {
  pending: string,
  inProgress: string,
  completed: string
}

const TASK_STATUS: TaskStatus = {
  pending: 'Pending',
  inProgress: 'In progress',
  completed: 'Completed'
}

const selectedStatus = ref<string>(TASK_STATUS.pending)


function updateStatus(status: string) {
  selectedStatus.value = status
}

</script>
<template>
  <div class="todo__task-list">
    <div class="todo__task-card">
      <h2>Title</h2>
      <p> this is descrption this is descrption</p>
      <div v-for="(label, status) in TASK_STATUS" :key="status" class="todo__task-status">
        <label>
          <input 
            type="checkbox" 
            :value="status" 
            :checked="selectedStatus === status"
            @change="updateStatus(status)"
          />
        {{ label }}
      </label>
      </div>
    </div>
  </div>
</template>


<style scoped>
</style>
