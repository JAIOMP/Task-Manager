<script setup lang="ts">
import TaskManager from './components/task/TaskManager.vue';
</script>

<template>
  <TaskManager class="task-manager"/>
</template>


<style lang="scss">
@import '@/assets/styles/main.scss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
}

.task-manager {
  @include media-range('mobile', 'desktop') {
    margin: 0 32px; 
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
