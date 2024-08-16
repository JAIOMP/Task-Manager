<script setup lang="ts">
import TaskStatus from './TaskStatus.vue'
import { useTaskStore } from '@/stores/taskStore'
import Heading from './atoms/Heading.vue'

const { setFilters } = useTaskStore()

</script>

<template>
  <div class="todo__task-filter">
    <Heading tag="h3">Select status: </Heading>
    <TaskStatus 
      :isFilter="true"
      :setFilter="setFilters"
    />
  </div>
</template>

<style scoped>
.todo__task-filter {
  width: 176px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
