<script setup lang="ts">
import TaskList from './TaskList.vue';
import TaskFilter from './TaskFilter.vue';
import UpdateTask from './UpdateTask.vue'

</script>

<template>
  <div class="todo__task-manager">
    <TaskFilter />
    <TaskList />
    <UpdateTask />
  </div>
</template>


<style scoped>
.todo__task-manager {
  display: flex;
  column-gap: 48px;
}
</style>
