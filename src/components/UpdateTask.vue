<script setup lang="ts">
import { ref, withDefaults, defineProps } from 'vue'
import TaskStatus from './TaskStatus.vue'
import TaskInput from './TaskInput.vue'

type Status = 'Pending' | 'In progress' | 'Completed';

interface Task {
  id: string | null
  title: string
  description: string
  dueDate: string
  status: Status
}

interface Props {
  id: string | null
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

const formData = ref<Task>({
  id: props.id,
  title: props.title,
  description: props.description,
  dueDate: props.dueDate,
  status: props.dueDate as Status,
})

const isVisible = ref<boolean>(true)

function handleSubmit() {
  
}

function closeModal() {

}

</script>
<template>
  <div v-if="isVisible" class="todo__task-update-form" @click.self="closeModal">
    <div class="todo__task-form-content">
      <button class="todo__task-form-close-btn" @click="closeModal">&times;</button>
      <h2>{{ modalTitle }}</h2>
      <form @submit.prevent="handleSubmit">
          <TaskInput placeholder="Enter your task here..." id="title" :value="formData.title" required />
        
          <TaskInput placeholder="Enter your description here..." id="description" :value="formData.description" required />
        
          <TaskInput type="date" id="dueDate" :value="formData.dueDate" required />
        
          <TaskStatus :taskStatus="formData.status"/>        
        <button type="submit">Submit</button>
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
.form-group {
  margin-bottom: 15px;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
