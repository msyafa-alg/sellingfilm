'use client'

import { useState, useEffect } from 'react'
import { Clock, QrCode, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import CountdownTimer from './components/CountdownTimer'
import { useToast } from '@/components/Toast'
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

  return (
    <CheckoutForm tier={tier} profile={profile} tierId={tierId} user={user} initialInvoice={pendingInvoice || null} />
  )
}

function CheckoutForm({ tier, profile, tierId, user, initialInvoice }: { tier: any; profile: any; tierId: string; user: any; initialInvoice: any }) {
  const { addToast } = useToast()
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [pendingInvoice, setPendingInvoice] = useState<any>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const { createClient } = require('@/lib/supabase/client')

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
    const fetchPendingInvoice = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('tier_id', tierId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .single()
      setPendingInvoice(invoiceData)
    }
    fetchPendingInvoice()
  }, [tierId, supabase])

  const handleCreateInvoice = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payment/create-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create invoice')
      setInvoice(data.data)
      addToast('success', 'Payment QR generated successfully')
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice')
      addToast('error', err.message || 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async () => {
    if (!invoice) return
    setCheckingStatus(true)
    try {
      const { data: invoiceData, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoice.id)
        .single()
      if (error) throw new Error('Failed to check payment status')
      if (invoiceData.status === 'paid') {
        addToast('success', 'Payment confirmed! Redirecting...')
        window.location.href = `/payment/success?invoice_id=${invoiceData.saya_bayar_id}`
      } else {
        setInvoice(invoiceData)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check payment status')
      addToast('error', err.message || 'Failed to check payment status')
    } finally {
      setCheckingStatus(false)
    }
  }

  useEffect(() => {
    if (!invoice || invoice.status === 'paid') return
    const interval = setInterval(checkPaymentStatus, 5000)
    return () => clearInterval(interval)
  }, [invoice])

  const displayInvoice = invoice || pendingInvoice

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

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!displayInvoice ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-6">Click button below to generate payment QR</p>
              <button
                onClick={handleCreateInvoice}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    Generate QR Payment
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment Instructions</h2>
              <p className="text-slate-400 text-sm mb-6">Scan the QR code below to complete your payment using Saya Bayar.</p>

              <div className="flex justify-center mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(displayInvoice.qris_string)}&size=256x256`}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>

              <div className="bg-slate-900 p-4 rounded-lg mb-4">
                <p className="text-sm text-slate-400 mb-2">Or copy payment link:</p>
                <div className="flex gap-2">
                  <code className="flex-1 text-sm text-slate-300 font-mono break-all bg-slate-950 p-2 rounded border border-slate-800">
                    {displayInvoice.payment_url}
                  </code>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
                <Clock className="w-4 h-4" />
                <span>Payment expires in:</span>
                <CountdownTimer expiresAt={new Date(displayInvoice.expires_at)} />
              </div>

              <button
                onClick={checkPaymentStatus}
                disabled={checkingStatus || displayInvoice.status === 'paid'}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {checkingStatus ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking...
                  </>
                ) : displayInvoice.status === 'paid' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Payment Confirmed
                  </>
                ) : (
                  'Check Payment Status'
                )}
              </button>
            </div>
          )}

          <p className="text-center text-xs text-slate-500 mt-6">
            By completing this purchase, you agree to our terms of service.
            Your subscription will be activated immediately after payment confirmation.
          </p>
        </div>
      </div>
    </div>
  )
}
