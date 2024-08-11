<script setup lang="ts">
import { ref, withDefaults, defineProps } from 'vue'
import TaskStatus from './TaskStatus.vue'
import Heading from './atoms/Heading.vue'

interface Props {
  setFilters: Function
}

const props = withDefaults(defineProps<Props>(), {
  setFilters: () => {}
})

const filters = ref<string[]>([])

function setFilter(event: Event) {
  const target = event.target as HTMLInputElement

  if(target.checked) {
    filters.value.push(target.value)
    props.setFilters(filters.value)
  }
}

</script>

<template>
  <div class="todo__task-filter">
    <Heading tag="h3">Select status: </Heading>
    <TaskStatus 
      :isFilter="true"
      :setFilter="setFilter"
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
