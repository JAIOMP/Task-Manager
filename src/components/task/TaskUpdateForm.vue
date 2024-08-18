<script setup lang="ts">
import { ref, withDefaults, defineProps, inject} from 'vue'
import { Status, Task } from '../../configs/types'
import { DEFAULT_TASK } from '../../configs/constants'
import TaskStatus from './TaskStatus.vue'
import TaskInput from '../atoms/Input.vue'
import TaskButton from '../atoms/Button.vue'
import Heading from '../atoms/Heading.vue'
import { useTaskStore } from '../../stores/taskStore'

interface Props {
  id?: number | null
  title?: string
  description?: string
  dueDate?: string
  status?: Status
  modalTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  ...DEFAULT_TASK,
  modalTitle: 'Add'
})

const store = useTaskStore()

const task = ref<Task>({
  id: props.id || Date.now(),
  title: props.title,
  description: props.description,
  dueDate: props.dueDate,
  status: props.status as Status,
})

const taskStore = useTaskStore()
const handleEvent = inject<Function>('update-task')

const formError = ref<string | null>(null)

function validateForm(): boolean {
  let isValid = true;

  if (!task.value.title || !task.value.dueDate || !task.value.status) {
    formError.value = 'Oops! You missed a spot! Don’t forget the Title, Due Date, and Status!'
    isValid = false
  } else {
    formError.value = null
  }

  return isValid
}

function updateTask(): void {
  if(handleEvent) {
    handleEvent()
  }
}

function handleSubmit(): void {
  if (validateForm()) {
    if (props.modalTitle === 'Update') {
      taskStore.updateTask(task.value);
    } else {
      taskStore.addTask({ ...task.value, id: Date.now() });
    }
    task.value = { id: Date.now(), title: '', description: '', status: 'Pending', dueDate: '' }
    closeModal()
  }
}

function closeModal(): void {
  store.openAddTask = false
  updateTask()
}

function updateStatus(status: Status): void {
  task.value.status = status
}

</script>
<template>
  <div class="todo__task-update-form" @click.self="closeModal">
    <div class="todo__task-form-content">
      <TaskButton customClass="todo__task-form-cross" class="todo__task-form-close-btn" value="&times;" @click="closeModal" />

      <form class="todo__task-form" @submit.prevent="handleSubmit">
        <Heading tag="h2">{{ modalTitle }}</Heading>

        <TaskInput 
          placeholder="Enter your task title here..." 
          id="title" 
          :value="task.title" 
          v-model="task.title"
          required 
        />

        <TaskInput 
          placeholder="Enter your task description here..." 
          id="description" 
          :value="task.description"
          v-model="task.description"
        />

        <TaskInput 
          type="date" 
          id="dueDate" 
          :value="task.dueDate" 
          v-model="task.dueDate" 
          required 
        />

        <Heading v-if="formError" tag="p" class="error-message"> {{ formError }} </Heading>

        <TaskStatus :taskStatus="task.status" :updateStatus="updateStatus" />

        <TaskButton type="submit" value="Save" />
      </form>
    </div>
  </div>
</template>


<style lang="scss">
@import '@/assets/styles/main.scss';
.todo__task-update-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.todo__task-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 16px;
}
.todo__task-form-content {
  background: white;
  padding: 32px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;

  @include media-range('mobile', 'tablet') {
    height: 100%;    
    border-radius: 0;
  }
}
.todo__task-form-cross {
  font-size: $font-size-xlarge;
  background-color: $card-bg-color;
  color: $muted-text-color;
  transition: transform 0.4s ease;
}
.todo__task-form-cross:hover {
  background-color: $card-bg-color;
  transform: scale(1.2);
}
.todo__task-form-close-btn {
  position: absolute;
  top: 32px;
  right: 32px;
  background: none;
  border: none;
  font-size: $font-size-large;
  cursor: pointer;
}
</style>
