import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

async function createServerClientWithCookies() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{name: string, value: string, options: any}>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function signIn(formData: FormData) {
  'use server'

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const supabase = await createServerClientWithCookies()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent('Email atau password salah.')}`)
  }

  redirect('/')
}

export async function signUp(formData: FormData) {
  'use server'

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  if (!email || !password || !fullName) {
    throw new Error('All fields are required')
  }

  const supabase = await createServerClientWithCookies()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    console.error('Signup error:', error)
    const message =
      error.message.includes('rate limit')
        ? 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.'
        : error.message.includes('already registered') || error.message.includes('User already')
          ? 'Email sudah terdaftar, silakan login.'
          : 'Pendaftaran gagal. Coba lagi.'
    redirect(`/signup?error=${encodeURIComponent(message)}`)
  }

  redirect('/login')
}

export async function signOut() {
  'use server'

  const supabase = await createServerClientWithCookies()
  await supabase.auth.signOut()
  redirect('/')
}
