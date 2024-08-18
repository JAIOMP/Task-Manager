<script setup lang="ts">
import TaskManager from './components/task/TaskManager.vue';
import Header from './components/shared/Header.vue';
</script>

<template>
  <Header />
  <TaskManager class="task-manager"/>
</template>


<style lang="scss">
@import '@/assets/styles/main.scss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.task-manager {
  margin: 0 96px;

  @include media-range('mobile', 'desktop') {
    margin: 0 32px; 
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
