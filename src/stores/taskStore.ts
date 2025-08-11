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
    tagFilters: {} as Filters,
    isSortedByDueDate: false,
    searchQuery: '' as string,
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
      
      if(filterTarget?.checked) {
        this.filters[filterTarget?.value] = true
      } else {
        delete this.filters[filterTarget?.value]
      }
      this.applyFiltersAndSearch();
    },
    setTagFilters(event?: Event): void {
      const filterTarget = (event?.target as HTMLInputElement)
      if (filterTarget?.checked) {
        this.tagFilters[filterTarget?.value] = true
      } else {
        delete this.tagFilters[filterTarget?.value]
      }
      this.applyFiltersAndSearch();
    },
    sortTasks(event?: Event): void {
      const target = event!.target as HTMLInputElement
      if(target.checked) {
        this.tasks.sort((task1, task2) => task1.dueDate.localeCompare(task2.dueDate))
      } else {
        this.setFilters()
      }
    },
    setSearchQuery(query: string) {
      this.searchQuery = query.toLowerCase();
      this.applyFiltersAndSearch();
    },
    applyFiltersAndSearch() {
      let filteredTasks = [...this.initTasks];

      const activeFilters = Object.keys(this.filters);
      if (activeFilters.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
          activeFilters.includes(task.status as string)
        );
      }

      const activeTags = Object.keys(this.tagFilters)
      if (activeTags.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
          activeTags.some(tag => task.tags?.includes(tag))
        )
      }

      if (this.searchQuery) {
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(this.searchQuery) ||
          task.description.toLowerCase().includes(this.searchQuery) ||
          (task.tags?.some(tag => tag.toLowerCase().includes(this.searchQuery)) ?? false)
        );
      }

      this.tasks = filteredTasks;
    }
  },
  persist: true,
})
