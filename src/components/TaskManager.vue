<script setup lang="ts">
import { computed, ref } from 'vue';
import TaskList from './TaskList.vue';
import TaskFilter from './TaskFilter.vue';
import UpdateTask from './UpdateTask.vue'
import { Status, Task } from '@/configs/types';

const initTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description for Task 1',
      dueDate: '2023-08-01',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description for Task 2',
      dueDate: '2023-08-05',
      status: 'Completed',
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description for Task 3',
      dueDate: '2023-08-05',
      status: 'In progress',
    },
    {
      id: 4,
      title: 'Task 4',
      description: 'Description for Task 4',
      dueDate: '2023-08-01',
      status: 'Pending',
    },
    {
      id: 5,
      title: 'Task 5',
      description: 'Description for Task 5',
      dueDate: '2023-08-05',
      status: 'Completed',
    },
    {
      id: 6,
      title: 'Task 6',
      description: 'Description for Task 6',
      dueDate: '2023-08-05',
      status: 'In progress',
    },
]
const statuses = ref<Status[]>([])

const tasks = computed(() => {
  if(statuses.value.length > 0) {
    for(const status of statuses.value) {
      console.log(status, initTasks.filter((task) => task.status === status))
      return initTasks.filter((task) => task.status === status)
    }
  }
   return initTasks
})

function setFilters(filters: Status[]) {
  statuses.value = filters
}
</script>

<template>
  <div class="todo__task-manager">
    <TaskFilter 
      :setFilters="setFilters"
    />
    <TaskList 
      :tasks="tasks"
    />
    <UpdateTask />
  </div>
</template>


<style scoped>
.todo__task-manager {
  display: flex;
  column-gap: 48px;
}
</style>
