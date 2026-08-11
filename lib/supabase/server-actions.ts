'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PayGetClient } from '@/lib/payget/client'

async function createServerClientWithCookies() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: Array<{name: string, value: string, options: any}>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}

export async function createInvoice(user: { id: string; email: string; full_name: string }, tier: { id: string; name: string; price: number }) {
  const payGet = new PayGetClient(process.env.PAYGET_API_KEY!)
  const supabase = await createServerClientWithCookies()
  const response = await payGet.createInvoice(tier.price)
  if (!response.success) throw new Error('Failed to create invoice')
  const { error: insertError } = await supabase.from('invoices').insert({
    saya_bayar_id: response.invoice_id,
    invoice_number: response.invoice_id,
    user_id: user.id,
    tier_id: tier.id,
    amount: response.amount,
    status: 'pending',
    qris_string: response.qris_image,
    payment_url: response.payment_link,
  }).select().single()
  if (insertError) throw new Error(insertError.message)
  return {
    id: response.invoice_id,
    invoice_number: response.invoice_id,
    qris_string: response.qris_image,
    payment_url: response.payment_link,
    expires_at: response.expired_at,
  }
}

export async function createSubscription(user: { id: string }, tier: { id: string }, expiresAt: string) {
  const supabase = await createServerClientWithCookies()
  const { error } = await supabase.from('subscriptions').upsert({
    user_id: user.id,
    tier_id: tier.id,
    status: 'active',
    expires_at: expiresAt,
  }).select().single()
  if (error) throw new Error(error.message)
}
