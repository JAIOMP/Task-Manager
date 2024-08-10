<script setup lang="ts">
import { ref } from 'vue';

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
      <div class="todo__task-title-desc">
        <h2 class="todo__task-title">{{  task.title }}</h2>
        <p>{{ task.description }}</p>
      </div>
      <div class="todo__task-status-date">
        <div class="todo__task-date">
          <img width="20" height="20" src="@/assets/icon-calendar.svg" alt="calendar" />
          <p>
            {{ task.dueDate }}
          </p>
        </div>
        <div class="todo__task-status">
          {{ task.status }}
        </div>
      </div>
      <div class="todo__task-footer">
        <img width="20" height="20" src="@/assets/icon-edit.svg" alt="edit" />
        <img width="20" height="20" src="@/assets/icon-delete.svg" alt="delete" />
      </div>
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
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  text-align: left;
  border-radius: 8px;
  background-color: #ffff;
  padding: 40px 32px;
  transition: all .5s ease-in-out;
}

.todo__task-title-desc {
   border-bottom: 1px solid #e6e6e6;
}

.todo__task-title {
  margin-top: 0;
}

.todo__task-status-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 8px;
}

.todo__task-date {
  display: flex;
  column-gap: 4px;
  align-items: center;
}

.todo__task-status {
  padding: 8px;
  border-radius: 8px;
  background-color: #afd275;
}

.todo__task-footer {
  display: flex;
  justify-content: flex-end;
  column-gap: 16px;
}

.todo__task-footer img {
  cursor: pointer;
}

.todo__task-card:hover {
  opacity: 1;
  box-shadow: 0 24px 32px -16px rgba(0, 95, 247, .15);
}
</style>
