<script setup lang="ts">
import { useTaskStore } from '../../stores/taskStore'
import TaskCard from './TaskCard.vue'

const store = useTaskStore()

</script>
<template>
  <div class="todo__task-list">
    <TaskCard 
      v-for="task in store.tasks" 
      :key="task.id" 
      :task="task"
    />
  </div>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/media-queries';

.todo__task-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;

  @include media-range('mobile', 'desktop') {
    grid-template-columns: repeat(2, 1fr);    
  }

  @include media-range('mobile', 'tablet') {
    grid-template-columns: 1fr    
  }
}
</style>
