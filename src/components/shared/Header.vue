<script setup lang="ts">
import { useTaskStore } from '../../stores/taskStore'
// @ts-ignore - Vue SFC default export shim
import TaskButton from '../atoms/Button.vue'
import { useAuth } from '../../lib/useAuth'
const { user, signOut, signInWithGoogle } = useAuth()

const store = useTaskStore()

function addTask(): void {
  store.openAddTask = true
}

</script>

<template>
  <header class="task-manager__header">
    <h1 class="task-manager__header-title">Task Master</h1>
    <div class="task-manager__header-buttons">
      <template v-if="user">
        <TaskButton class="task-manager__header-button" value="Add Task" @click="addTask" />
        <button @click="signOut">Sign out</button>
      </template>
      <template v-else>
        <button class="task-manager__cta" @click="signInWithGoogle">Sign in</button>
      </template>
    </div>
  </header>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/media-queries';
@import '@/assets/styles/variables.scss';

.task-manager__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: start;
  margin: 24px 0;
}

.task-manager__header-title {
  margin: 0;
}

.task-manager__header-buttons {
  display: flex;
  gap: 16px;
}

.task-manager__cta {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid $primary-color;
  background: $primary-color;
  color: #fff;
  cursor: pointer;
}
</style>
