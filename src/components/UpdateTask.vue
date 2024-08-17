<script setup lang="ts">
import { ref, withDefaults, defineProps, inject} from 'vue'
import { Status, Task } from '@/configs/types'
import TaskStatus from './TaskStatus.vue'
import TaskInput from './atoms/Input.vue'
import TaskButton from './atoms/Button.vue'
import Heading from './atoms/Heading.vue'
import { useTaskStore } from '@/stores/taskStore'

interface Props {
  id: number | null
  title: string
  description: string
  dueDate: string
  status: Status
  modalTitle: string
}

const props = withDefaults(defineProps<Props>(), {
  id: null,
  title: '',
  description: '',
  dueDate: '',
  status: 'Pending',
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

function updateTask() {
  if(handleEvent) {
    handleEvent()
  }
}

function handleSubmit() {
  if (task.value.title && task.value.description) {
    if (props.modalTitle === 'Update') {
      taskStore.updateTask(task.value);
    } else {
      taskStore.addTask({ ...task.value, id: Date.now() });
    }
    task.value = { id: Date.now(), title: '', description: '', status: 'Pending', dueDate: '' }
    closeModal()
  }
}

function closeModal() {
  store.openAddTask = false
  updateTask()
}

function updateStatus(status: Status) {
  task.value.status = status
}

</script>
<template>
  <div class="todo__task-update-form" @click.self="closeModal">
    <div class="todo__task-form-content">
      <TaskButton class="todo__task-form-close-btn" value="&times;" color="--pale-sky" @click="closeModal"/>

      <form class="todo__task-form" @submit.prevent="handleSubmit">
          <Heading tag="h2">{{ modalTitle }}</Heading>

          <TaskInput placeholder="Enter your task here..." id="title" :value="task.title" v-model="task.title" required />
        
          <TaskInput placeholder="Enter your description here..." id="description" :value="task.description" v-model="task.description" required />
        
          <TaskInput type="date" id="dueDate" :value="task.dueDate" v-model="task.dueDate" required />
        
          <TaskStatus :taskStatus="task.status" :updateStatus="updateStatus"/>

          <TaskButton type="submit" value="Save" color="--earth-brown"/>
      </form>
    </div>
  </div>
</template>


<style scoped>
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
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
}
.todo__task-form-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
