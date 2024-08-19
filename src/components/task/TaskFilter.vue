<script setup lang="ts">
import TaskStatus from './TaskStatus.vue'
import { withDefaults, defineProps } from 'vue'
import TaskSearch from './TaskSearch.vue'
import Heading from '../atoms/Heading.vue'
import Checkbox from '../atoms/Checkbox.vue'

interface Props {
  setFilters?: () => void
  sortTaskByDueDate?: () => void
}

withDefaults(defineProps<Props>(), {
  setFilters: () => {},
  sortTaskByDueDate: () => {}
})

</script>

<template>
  <div class="todo__task-filter">
    <TaskSearch class="todo__task-filter-search"/>
    <div class="todo__task-filter-status">
      <Heading tag="h3">Select status: </Heading>
      <TaskStatus 
        :isFilter="true"
        :setFilter="setFilters"
      />
    </div>

    <div class="todo__task-filter-sort">
      <Heading tag="h3">Sort by: </Heading>
      <Checkbox label="Due date" value="Due date" :change="sortTaskByDueDate" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/media-queries';

.todo__task-filter {
  display: flex;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 32px;
  flex-direction: column;

  @include media('desktop') {
    width: 176px;
  }

  @include media-range('mobile', 'desktop') {
    flex-direction: unset;
    justify-content: space-around;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 16px;
    place-items: start;

    .todo__task-filter-search {
      grid-column: 1 / -1;
    }

    .todo__task-filter-status,
    .todo__task-filter-sort {
      grid-column: span 1;
    }
  }
}
.todo__task-filter-status {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.todo__task-filter-sort {
  text-align: start;
}
</style>
