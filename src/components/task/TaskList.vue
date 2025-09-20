<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import { onMounted } from 'vue'
import { getTodos } from '../../lib/supabase'
import { ref } from 'vue'

const todos = ref([])

onMounted(async () => {
  try {
    const todosFromDB = await getTodos()
    todos.value = todosFromDB
  } catch (error) {
    console.error('Failed to fetch todos:', error)
  }
})

</script>
<template>
  <div class="todo__task-list">
    <TaskCard 
      v-for="task in todos"
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
