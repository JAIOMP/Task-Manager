<script setup lang="ts">
import { provide, ref } from 'vue'
import { Task } from '../../configs/types'
import { useTaskStore } from '../../stores/taskStore'
import { DEFAULT_TASK } from '../../configs/constants'
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

function updateTask(task: Task | undefined) {
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
    <TaskFilter :setFilters="store.setFilters" :sortTaskByDueDate="store.sortTasks"/>
    <TaskList />
    <TaskUpdateForm 
      v-if="store.openAddTask"
      :id="updatedTask.id"
      :title="updatedTask.title"
      :description="updatedTask.description"
      :dueDate="updatedTask.dueDate"
      :status="updatedTask.status"
      :modalTitle="updatedTask.modalTitle"
    />
  </div>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/media-queries';

.todo__task-manager {
  @include media('desktop') {   
    display: flex;
    column-gap: 48px;
  }
}
</style>
