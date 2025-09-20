<template>
  <div class="login">
    <button @click="signInWithGoogle">Sign in with Google</button>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '../../lib/useAuth'
const { signInWithGoogle } = useAuth()
</script>
