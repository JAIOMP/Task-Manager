<script setup lang="ts">
import { ref } from 'vue';
import TaskStatus from './TaskStatus.vue'

const tasks = ref<any[]>([
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
  ])

</script>
<template>
  <div class="todo__task-list">
    <div v-for="task in tasks" :key="task.id" class="todo__task-card">
      <div>
        <h2>{{  task.title }}</h2>
        <p>Due date: {{ task.dueDate }}</p>
      </div>
      <p>{{ task.description }}</p>
      <TaskStatus :taskStatus="task.status" />
    </div>
  </div>
</template>


<style scoped>
.todo__task-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.todo__task-card {
  border-radius: 8px;
  background-color: #ffff;
  padding: 40px 32px;
  transition: all .5s ease-in-out;
}

.todo__task-card:hover {
  opacity: 1;
  box-shadow: 0 24px 32px -16px rgba(0, 95, 247, .15);
}
</style>
