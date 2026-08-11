export async function createServerClientComponent() {
  const { createServerClient } = await import('@supabase/ssr')
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{name: string, value: string, options: any}>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

export async function getPendingInvoice(userId: string, tierId: string) {
  const supabase = await createServerClientComponent()
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .eq('tier_id', tierId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .single()
  if (error && error.code !== 'PGRST116') return null
  return invoice
}
