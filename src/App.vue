<script setup lang="ts">
import TaskManager from './components/TaskManager.vue';
import Header from './components/Header.vue';
</script>

<template>
  <Header />
  <TaskManager class="task-manager"/>
</template>


<style lang="scss">
@import '@/assets/styles/media-queries';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  background-color: #c2cad026;
  margin: 0;
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
