<script setup lang="ts">
import { useTaskStore } from '@/stores/taskStore'
import TaskList from './TaskList.vue'
import TaskFilter from './TaskFilter.vue'
import UpdateTask from './UpdateTask.vue'

const store = useTaskStore()

</script>

<template>
  <div class="todo__task-manager">
    <TaskFilter :setFilters="store.setFilters" :sortTaskByDueDate="store.sortTasks"/>
    <TaskList />
    <UpdateTask v-if="store.openAddTask"/>
  </div>
</template>


<style scoped>
.todo__task-manager {
  display: flex;
  column-gap: 48px;
}
</style>
