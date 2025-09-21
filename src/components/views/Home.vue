<template>
  <div>
    <div v-if="!user">
      <h2>Welcome to Task Manager</h2>
      <p>You are not signed in.</p>
      <Login />
    </div>
    <div v-if="user">
      <main>
        <TaskManager class="task-manager"/>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '../../lib/useAuth'
import TaskManager from '../task/TaskManager.vue'
import Login from '../user/Login.vue'
const { user } = useAuth()
</script>

<style scoped>
button {
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}
</style>
