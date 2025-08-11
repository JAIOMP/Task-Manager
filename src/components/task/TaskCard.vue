<script setup lang="ts">
import { inject } from 'vue'
import { Task } from '../../configs/types'
import { DEFAULT_TASK } from '../../configs/constants'
import { withDefaults, defineProps } from 'vue'
import { useTaskStore } from '../../stores/taskStore'

interface Props {
  task: Task
}

withDefaults(defineProps<Props>(), {
  task: () => DEFAULT_TASK
})

const store = useTaskStore()
const handleEvent = inject<Function>('update-task')

function updateTask(task: Task): void {
  if(handleEvent) {
    handleEvent(task, 'Update')
  }
}

function deleteTaskById(taskId: number | null): void {
  // Keep behavior compatible with existing tests which pass null ids
  store.deleteTask((taskId as unknown) as number)
}

</script>

<template>
   <div class="todo__task-card">
      <div class="todo__task-title-desc">
        <h2 class="todo__task-title">{{  task.title }}</h2>
        <p>{{ task.description }}</p>
      </div>
      <div class="todo__task-status-date">
        <div class="todo__task-date">
          <img width="20" height="20" src="@/assets/icons/icon-calendar.svg" alt="calendar" />
          <p>
            {{ task.dueDate }}
          </p>
        </div>
        <div class="todo__task-status" :class="['status-label', task.status?.replace(' ', '-').toLowerCase()]">
          {{ task.status }}
        </div>
      </div>
      <div v-if="task.tags?.length" class="todo__task-tags">
        <span v-for="tag in task.tags" :key="tag" class="todo__task-tag">#{{ tag }}</span>
      </div>
      <div class="todo__task-footer">
        <img width="20" height="20" src="@/assets/icons/icon-edit.svg" alt="edit" @click="() => updateTask(task)"/>
        <img width="20" height="20" src="@/assets/icons/icon-delete.svg" alt="delete" @click="deleteTaskById(task.id)"/>
      </div>
    </div>
</template>


<style scoped>
.todo__task-card {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  max-width: 480px;
  text-align: left;
  border-radius: 8px;
  padding: 40px 32px;
  transition: all .5s ease-in-out;
}

.todo__task-title {
  margin-top: 0;
}

.todo__task-status-date {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 8px;
}

.todo__task-date {
  display: flex;
  column-gap: 4px;
  align-items: center;
}

.todo__task-status {
  padding: 8px;
  border-radius: 8px;
}

.todo__task-footer {
  display: flex;
  justify-content: flex-end;
  column-gap: 16px;
}

.todo__task-footer img {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.todo__task-footer img:hover {
  transform: scale(1.3);
} 

.todo__task-card:hover {
  opacity: 1;
  box-shadow: 0 24px 32px -16px rgba(0, 95, 247, .15);
}

.todo__task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.todo__task-tag {
  background-color: #f0f4ff;
  color: #2d5bff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}
</style>
