<script setup lang="ts">
import TaskList from './components/TaskList.vue';
</script>

<template>
  <TaskList />
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px 90px 0 90px;
}
body {
  background-color: #c2cad026;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
