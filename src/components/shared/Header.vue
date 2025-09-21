<script setup lang="ts">
import { useTaskStore } from '../../stores/taskStore'
import TaskButton from '../atoms/Button.vue'
import { useAuth } from '../../lib/useAuth'
const { user, signOut } = useAuth()

const store = useTaskStore()

function addTask(): void {
  store.openAddTask = true
}

</script>

<template>
  <header v-if="user" class="task-manager__header">
    <h1 class="task-manager__header-title">Task Manager</h1>
    <div class="task-manager__header-buttons">
      <TaskButton class="task-manager__header-button" value="Add Task" @click="addTask" />
      <button @click="signOut">Sign out</button>
    </div>
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

  .task-manager__header-buttons {
    display: flex;
    gap: 16px;
  }
}
</style>
