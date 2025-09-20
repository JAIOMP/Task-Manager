import { Task } from '@/configs/types'
import { createTodo, deleteTodo, updateTodo } from '@/lib/supabase';
import { defineStore } from 'pinia';

interface Filters {
  [key: string]: boolean;
}

import { useAuth } from '../lib/useAuth'
const { user } = useAuth()

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
    setTasks(tasks: Task[]): void {
      this.initTasks = tasks;
      this.tasks = [...this.initTasks];
      this.applyFiltersAndSearch();
    },
    async addTask(task: Task): Promise<void> {
      // Update local state immediately
      this.initTasks.push(task)
      this.tasks = [...this.initTasks]

      try {
        // Save to Supabase
        await createTodo(
          task.title,
          user.value?.id || '',
          task.description,
          task.dueDate,
          task.tags || []
        )
      } catch (error) {
        console.error('Failed to create todo in Supabase:', error)
      }
    },
    async updateTask(updatedTask: Task): Promise<void> {
      const index = this.initTasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        this.initTasks[index] = updatedTask;
      }
      this.tasks = [...this.initTasks]

      try {
        // Save to Supabase
        if (updatedTask.id !== null) {
          await updateTodo(updatedTask.id,
            {
              title: updatedTask.title,
              description: updatedTask.description,
              due_date: updatedTask.dueDate,
              tags: updatedTask.tags || [],
              status: updatedTask.status,
              completed: updatedTask.status === 'Completed'
            }
          )
        } else {
          console.error('Task ID is null, cannot update task');
        }
      } catch (error) {
        console.error('Failed to update todo in Supabase:', error)
      }
    },
    deleteTask(taskId: number): void {
      this.initTasks = this.initTasks.filter(task => task.id !== taskId);
      this.tasks = [...this.initTasks]
      this.setFilters()
      deleteTodo(taskId).catch(error => {
        console.error('Failed to delete todo in Supabase:', error)
      }
      )
    },
    setFilters(event?: Event): void {
      const filterTarget = (event?.target as HTMLInputElement)

      if (filterTarget?.checked) {
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
      if (target.checked) {
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
