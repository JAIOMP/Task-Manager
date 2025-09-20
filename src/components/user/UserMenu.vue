<template>
  <div v-if="user">
    <p>Welcome, {{ user.email }}</p>
    <button @click="signOut">Sign out</button>
  </div>
  <div v-else>
    <p>You are not signed in.</p>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '../../lib/useAuth'
const { user, signOut } = useAuth()
</script>
