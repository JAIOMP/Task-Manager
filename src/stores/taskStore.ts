import { Task } from '@/configs/types'
import { defineStore } from 'pinia';

export const useTaskStore = defineStore({
  id: 'taskStore',
  state: () => ({
    tasks: [] as Task[],
    filters: {} as { [key: string]: boolean }
  }),
  actions: {
    addTask(task: Task) {
      this.tasks.push(task);
    },
    updateTask(updatedTask: Task) {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    },
    deleteTask(taskId: number) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    setFilters(event: Event) {
      const filterTarget = (event.target as HTMLInputElement)
      
      if(filterTarget.checked) {
        this.filters[filterTarget.value] = true
      } else {
        delete this.filters[filterTarget.value]
      }
    }
  },
  persist: true,
})
