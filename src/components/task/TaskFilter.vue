<script setup lang="ts">
import TaskStatus from './TaskStatus.vue'
import { withDefaults, defineProps, computed } from 'vue'
import TaskSearch from './TaskSearch.vue'
import Heading from '../atoms/Heading.vue'
import Checkbox from '../atoms/Checkbox.vue'
import { useTaskStore } from '../../stores/taskStore'

interface Props {
  setFilters?: () => void
  sortTaskByDueDate?: () => void
  setTagFilters?: () => void
}

withDefaults(defineProps<Props>(), {
  setFilters: () => {},
  sortTaskByDueDate: () => {},
  setTagFilters: () => {}
})

const store = useTaskStore()
const uniqueTags = computed(() => {
  const all = store.initTasks.flatMap(task => task.tags ?? [])
  return Array.from(new Set(all))
})
</script>

<template>
  <nav role="navigation" class="todo__task-filter">
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

    <div class="todo__task-filter-tags" v-if="uniqueTags.length">
      <Heading tag="h3">Select tags: </Heading>
      <div class="todo__task-tags-list">
        <Checkbox 
          v-for="tag in uniqueTags" 
          :key="tag" 
          :label="tag" 
          :value="tag" 
          :change="setTagFilters" 
        />
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/media-queries';

.todo__task-filter {
  display: flex;
  align-items: flex-start;
  padding: 96px 48px;
  gap: 32px;
  flex-direction: column;
  background-color: #f9f9f9;
  border-color: #0d0d0d0d;
  border-width: 1px;
  border-style: solid;

  @include media('desktop') {
    width: 250px;
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
.todo__task-filter-tags {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.todo__task-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}
</style>
