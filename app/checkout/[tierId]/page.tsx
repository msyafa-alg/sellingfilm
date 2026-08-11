import { getTier } from '@/lib/supabase/db-actions'
import { createServerClientComponent } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth'

export default async function CheckoutPage({ params }: { params: Promise<{ tierId: string }> }) {
  const { tierId } = await params
  const tier = await getTier(tierId)
  const user = await requireAuth()

  if (!tier) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-7xl mx-auto px-4">Tier not found</div>
      </div>
    )
  }

  const supabase = await createServerClientComponent()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-7xl mx-auto px-4">Profile not found</div>
      </div>
    )
  }

  const { data: pendingInvoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .eq('tier_id', tierId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .single()

  if (pendingInvoice) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Payment Pending</h1>
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment Instructions</h2>
              <p className="text-slate-400 text-sm mb-6">Scan the QR code below to complete your payment using Saya Bayar.</p>
              <div className="flex justify-center mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(pendingInvoice.qris_string)}&size=256x256`}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>
              <div className="bg-slate-900 p-4 rounded-lg mb-4">
                <p className="text-sm text-slate-400 mb-2">Or copy payment link:</p>
                <code className="text-sm text-slate-300 font-mono break-all block bg-slate-950 p-2 rounded border border-slate-800">
                  {pendingInvoice.payment_url}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Complete Your Purchase</h1>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
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
              <span className="text-2xl font-bold text-white">Rp {tier.price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <form action="/api/payment/create-qris" method="POST" className="text-center py-8">
            <input type="hidden" name="tierId" value={tierId} />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <span className="text-2xl">💳</span>
              <span>Pay Now with QR</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
