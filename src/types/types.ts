import { Database } from "./supabase";

export type TodoInsert = Database['public']['Tables']['todos']['Insert']
export type TodoUpdate = Database['public']['Tables']['todos']['Update']
export type TodoRow = Database['public']['Tables']['todos']['Row']
