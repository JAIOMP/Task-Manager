import { createClient } from '@supabase/supabase-js'
import 'dotenv/config';
import type { Database } from '../types/supabase'

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

console.log(supabaseUrl, supabaseAnonKey, "---------");

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)