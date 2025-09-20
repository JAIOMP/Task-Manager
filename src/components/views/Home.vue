<template>
  <div>
    <div v-if="!user">
      <h2>Welcome to Task Manager</h2>
    </div>
    <UserMenu />
    <div v-if="user">
      <main>
        <TaskManager class="task-manager"/>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '../../lib/useAuth'
import UserMenu from '../user/UserMenu.vue'
import TaskManager from '../task/TaskManager.vue'
const { user } = useAuth()
</script>

<style scoped>
button {
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}
</style>