<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import { onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import { getTodos, supabase } from '../../lib/supabase'
import { computed } from 'vue'

const store = useTaskStore()

const todos = computed(() => store.tasks)

async function fetchTodos() {
  const todosFromDB = await getTodos()
  store.setTasks(todosFromDB)
}

function setupRealtime() {
  const channel = supabase
    .channel('todos-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'todos' },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload

        if (eventType === 'INSERT' && newRow) {
          store.addTask(newRow)
        } else if (eventType === 'UPDATE' && newRow) {
          store.updateTask(newRow)
        } else if (eventType === 'DELETE' && oldRow) {
          store.deleteTask(oldRow.id)
        }
      }
    )
    .subscribe()

  onUnmounted(() => {
    supabase.removeChannel(channel)
  })
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    // User not logged in yet, wait for login
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchTodos()
        setupRealtime()
      }
    })
    return
  }

  // User already logged in
  fetchTodos()
  setupRealtime()
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
