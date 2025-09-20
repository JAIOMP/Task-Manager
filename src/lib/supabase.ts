import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'
import { toRaw } from 'vue'
import { TodoInsert, TodoRow, TodoUpdate } from '@/types/types';

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

function normalizeTodoInput<T extends Partial<TodoInsert | TodoUpdate>>(todo: T): T {
  return {
    ...todo,
    tags: todo.tags ? toRaw(todo.tags) : undefined,
    due_date: todo.due_date ? new Date(todo.due_date).toISOString() : null,
  } as T
}

export async function getTodos(): Promise<TodoRow[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*') // select all columns
    .order('id', { ascending: true }) // optional

  if (error) {
    console.error('Error fetching todos:', error.message)
    throw error
  }

  return data || []
}

export async function createTodo(
  title: string,
  user_id: string,
  description = '',
  due_date = '',
  tags: string[] = []
) {
  const newTodo: TodoInsert = normalizeTodoInput({
    title,
    user_id,
    description,
    due_date,
    status: 'Pending',
    tags,
    completed: false,
  })

  const { data, error } = await supabase
    .from('todos')
    .insert([newTodo])
    .select()

  if (error) throw error
  return data
}

export async function updateTodo(
  id: number,
  updates: Partial<{
    title: string
    description: string
    due_date: string
    status: string
    tags: string[]
    completed: boolean
  }>
) {
  const updatedData: TodoUpdate = normalizeTodoInput(updates)

  const { data, error } = await supabase
    .from('todos')
    .update(updatedData)
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

export async function deleteTodo(id: number) {
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .select() // optional: return deleted row

  if (error) {
    console.error('Error deleting todo:', error.message)
    throw error
  }

  return data
}