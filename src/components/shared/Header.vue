<script setup lang="ts">
import { useTaskStore } from '../../stores/taskStore'
import TaskButton from '../atoms/Button.vue'

const store = useTaskStore()

function addTask(): void {
  store.openAddTask = true
}

</script>

<template>
    <header class="task-manager__header">
      <h1 class="task-manager__header-title">Task Manager</h1>
      <TaskButton class="task-manager__header-button" value="Add Task" @click="addTask"/>
    </header>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/media-queries';

.task-manager__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: start;
  margin: 24px 0;
}
</style>
