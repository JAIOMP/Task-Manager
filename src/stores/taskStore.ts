import { Task } from '@/configs/types'
import { defineStore } from 'pinia';

export const useTaskStore = defineStore({
  id: 'taskStore',
  state: () => ({
    initTasks: [] as Task[],
    tasks: [] as Task[],
    filters: {} as { [key: string]: boolean },
    isSortedByDueDate: false as boolean,
    openAddTask: false as boolean
  }),
  actions: {
    addTask(task: Task) {
      this.initTasks.push(task)
      this.tasks = this.initTasks
    },
    updateTask(updatedTask: Task) {
      const index = this.initTasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        this.initTasks[index] = updatedTask;
      }
    },
    deleteTask(taskId: number) {
      this.initTasks = this.initTasks.filter(task => task.id !== taskId);
      this.tasks = this.initTasks
      this.setFilters()
    },
    setFilters(event?: Event) {
      const filterTarget = (event?.target as HTMLInputElement)
      const tasks = []
      
      if(filterTarget?.checked) {
        this.filters[filterTarget?.value] = true
      } else {
        delete this.filters[filterTarget?.value]
      }

      const filtersName = Object.keys(this.filters)
  
      if(filtersName.length > 0) {
        for(const filter of filtersName) {
          for(const task of this.initTasks) {
            if(task.status === filter) {
              tasks.push(task)
            }
          }
        }
      } else {
        this.tasks = this.initTasks
        return
      }

      this.tasks = tasks
    },
    sortTasks(event?: Event) {
      const target = event!.target as HTMLInputElement
      if(target.checked) {
        this.tasks = this.tasks.sort((task1, task2) => task1.dueDate.localeCompare(task2.dueDate))
      } else {
        this.setFilters()
      }
    }
  },
  persist: true,
})
