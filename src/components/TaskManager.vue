<script setup lang="ts">
import { ref } from 'vue';
import TaskList from './TaskList.vue';
import TaskFilter from './TaskFilter.vue';
import UpdateTask from './UpdateTask.vue'
import { Status } from '@/configs/types';

const statuses = ref<Status[]>([])

function setFilters(filters: Status[]) {
  statuses.value = filters
}
</script>

<template>
  <div class="todo__task-manager">
    <TaskFilter 
      :setFilters="setFilters"
    />
    <TaskList />
    <UpdateTask />
  </div>
</template>


<style scoped>
.todo__task-manager {
  display: flex;
  column-gap: 48px;
}
</style>
