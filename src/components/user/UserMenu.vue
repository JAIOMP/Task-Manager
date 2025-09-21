<template>
  <div v-if="user">
    <button @click="signOut">Sign out</button>
  </div>
  <div v-else>
    <p>You are not signed in.</p>
    <Login />
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '../../lib/useAuth'
import Login from '../user/Login.vue';
const { user, signOut } = useAuth()
</script>
