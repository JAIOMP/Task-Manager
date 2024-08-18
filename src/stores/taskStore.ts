import { Task } from '@/configs/types'
import { defineStore } from 'pinia';

interface Filters {
  [key: string]: boolean;
}

export const useTaskStore = defineStore({
  id: 'taskStore',
  state: () => ({
    initTasks: [] as Task[],
    tasks: [] as Task[],
    filters: {} as Filters,
    isSortedByDueDate: false,
    openAddTask: false
  }),
  actions: {
    addTask(task: Task): void {
      this.initTasks.push(task)
      this.tasks = [...this.initTasks]
    },
    updateTask(updatedTask: Task): void {
      const index = this.initTasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        this.initTasks[index] = updatedTask;
      }
      this.tasks = [...this.initTasks]
    },
    deleteTask(taskId: number): void {
      this.initTasks = this.initTasks.filter(task => task.id !== taskId);
      this.tasks = [...this.initTasks]
      this.setFilters()
    },
    setFilters(event?: Event): void {
      const filterTarget = (event?.target as HTMLInputElement)
      const tasks = []
      
      if(filterTarget?.checked) {
        this.filters[filterTarget?.value] = true
      } else {
        delete this.filters[filterTarget?.value]
      }

      const activeFilters = Object.keys(this.filters)
  
      if (activeFilters.length > 0) {
        this.tasks = this.initTasks.filter((task) =>
          activeFilters.includes(task.status as string)
        );
      } else {
        this.tasks = [...this.initTasks];
      }
    },
    sortTasks(event?: Event): void {
      const target = event!.target as HTMLInputElement
      if(target.checked) {
        this.tasks.sort((task1, task2) => task1.dueDate.localeCompare(task2.dueDate))
      } else {
        this.setFilters()
      }
    }
  },
  persist: true,
})
