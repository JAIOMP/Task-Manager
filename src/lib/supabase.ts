import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
