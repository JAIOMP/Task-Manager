<script setup lang="ts">
import { provide, ref } from 'vue'
import { Task } from '../../configs/types'
import { useTaskStore } from '../../stores/taskStore'
import { DEFAULT_TASK } from '../../configs/constants'
import Heading from '../../components/atoms/Heading.vue'
import TaskList from './TaskList.vue'
import TaskFilter from './TaskFilter.vue'
import TaskUpdateForm from './TaskUpdateForm.vue'

const store = useTaskStore()

interface ModalTask extends Task {
  modalTitle: 'Add' | 'Update'
}

const initModalTask: ModalTask = {
  ...DEFAULT_TASK,
  modalTitle: 'Add'
}

const updatedTask = ref<ModalTask>(initModalTask)

provide('update-task', updateTask)

function updateTask(task: Task | undefined): void {
  if(task) {
    updatedTask.value = { ...task, modalTitle: 'Update' }
    store.openAddTask = true
  } else {
    updatedTask.value = initModalTask
  }
}
</script>

<template>
  <div class="todo__task-manager">
    <TaskFilter 
      v-if="store.initTasks.length > 1" 
      :setFilters="store.setFilters" 
      :setTagFilters="store.setTagFilters"
      :sortTaskByDueDate="store.sortTasks"
    />
    <main class="todo__task-manager-main">
      <TaskList />
      <Heading v-if="!store.tasks.length" tag="h2">Add your first task!</Heading>
      <TaskUpdateForm
        v-if="store.openAddTask"
        :id="updatedTask.id"
        :title="updatedTask.title"
        :description="updatedTask.description"
        :dueDate="updatedTask.dueDate"
        :status="updatedTask.status"
        :tags="updatedTask.tags"
        :modalTitle="updatedTask.modalTitle"
      />
    </main>
  </div>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/media-queries';

.todo__task-manager {
  @include media('desktop') {
    display: flex;
    height: 100%;
  }
}

.todo__task-manager-main {
  flex: 1;
  padding: 0 48px;
}
</style>
