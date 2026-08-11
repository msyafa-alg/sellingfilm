import { createServerClientComponent } from '@/lib/supabase/server'

export async function updateProfile(fullName: string) {
  'use server'

  const supabase = await createServerClientComponent()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: fullName,
      email: user.email,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }
}
