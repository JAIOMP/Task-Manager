<script setup lang="ts">
import { useTaskStore } from '../stores/taskStore'
import TaskButton from './atoms/Button.vue'

const store = useTaskStore()

function addTask() {
  store.openAddTask = true
}

</script>

<template>
    <header class="task-manager__header">
      <h1 class="task-manager__header-title">Task Manager</h1>
      <TaskButton class="task-manager__header-button" value="Add Task" color="--earth-brown" @click="addTask"/>
    </header>
</template>


<style scoped>
.task-manager__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  padding-left: 90px;
  margin-bottom: 24px;
  background-color: var(--pale-sky);
}
.task-manager__header-title {
  color: var(--coral-blush);
}
</style>
