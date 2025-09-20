import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const user = ref(await supabase.auth.getUser().then(r => r.data.user ?? null))

export function useAuth() {
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    if (error) console.error('Google sign-in error:', error.message)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  // Keep user in sync on refresh or auth state changes
  onMounted(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  })

  return { user, signInWithGoogle, signOut }
}
