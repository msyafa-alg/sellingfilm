import { requireAuth } from '@/lib/supabase/auth'
import { getTier, createInvoice } from '@/lib/supabase/db-actions'
import { createServerClientComponent } from '@/lib/supabase/server'
import QRCode from 'qrcode.react'
import { Clock } from 'lucide-react'
import CountdownTimer from './components/CountdownTimer'

export default async function CheckoutPage({ params }: { params: { tierId: string } }) {
  const tier = await getTier(params.tierId)

  if (!tier) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-7xl mx-auto px-4">Tier not found</div>
      </div>
    )
  }

  const user = await requireAuth()

  const supabase = createServerClientComponent()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const invoice = await createInvoice(
    {
      id: user.id,
      email: user.email!,
      full_name: profile?.full_name || user.email!.split('@')[0],
    },
    tier
  )

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            Complete Your Purchase
          </h1>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Order Summary
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <div>
                <p className="text-white font-medium">{tier.name}</p>
                <p className="text-slate-400 text-sm">Premium Programming Course</p>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
              <span className="text-slate-400">Total</span>
              <span className="text-2xl font-bold text-white">
                Rp {tier.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Payment Instructions
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Scan the QR code below to complete your payment using Saya Bayar QRIS.
            </p>

            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCode value={invoice.qris_string} size={200} />
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <p className="text-sm text-slate-300 font-mono break-all">
                {invoice.qris_string}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Payment expires in:</span>
              <CountdownTimer expiresAt={new Date(invoice.expires_at)} />
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            By completing this purchase, you agree to our terms of service.
            Your subscription will be activated immediately after payment confirmation.
          </p>
        </div>
      </div>
    </div>
  )
}
