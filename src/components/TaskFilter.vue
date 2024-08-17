<script setup lang="ts">
import TaskStatus from './TaskStatus.vue'
import { withDefaults, defineProps } from 'vue'
import Heading from './atoms/Heading.vue'
import Checkbox from './atoms/Checkbox.vue'

interface Props {
  setFilters: () => void
  sortTaskByDueDate: () => void
}

withDefaults(defineProps<Props>(), {
  setFilters: () => {},
  sortTaskByDueDate: () => {}
})

</script>

<template>
  <div class="todo__task-filter">
    <Heading tag="h3">Select status: </Heading>
    <TaskStatus 
      :isFilter="true"
      :setFilter="setFilters"
    />

    <div class="todo__task-filter-sort">
      <Heading tag="h3">Sort by: </Heading>
      <Checkbox label="Due date" value="Due date" :change="sortTaskByDueDate" />
    </div>
  </div>
</template>

<style scoped>
.todo__task-filter {
  width: 176px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.todo__task-filter-sort {
  margin-top: 16px;
}
</style>
