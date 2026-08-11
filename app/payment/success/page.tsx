import { redirect } from 'next/navigation'
import { createServerClientComponent } from '@/lib/supabase/server'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ invoice_id?: string }> }) {
  const { invoice_id } = await searchParams
  const supabase = createServerClientComponent()

  if (invoice_id) {
    const { data: invoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('saya_bayar_id', invoice_id)
      .single()

    if (invoice?.status === 'paid') {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', invoice.user_id)
        .eq('tier_id', invoice.tier_id)
        .single()

      if (subscription?.status === 'active') {
        return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Payment Successful!
              </h1>
              <p className="text-slate-400 mb-8">
                Your subscription has been activated. You now have access to all premium content.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        )
      }
    }
  }

  redirect('/dashboard')
}
