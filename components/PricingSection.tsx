# Pricing Section Component

import Link from 'next/link'
import { Check } from 'lucide-react'
import { getTiers } from '@/lib/supabase/db-actions'

export default async function PricingSection() {
  const tiers = await getTiers()

  return (
    <section id="pricing" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Start your programming journey today. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="relative bg-slate-900 rounded-2xl border border-slate-800 p-8 hover:border-blue-500/50 transition-colors"
            >
              {tier.name === 'Basic Tier' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">
                {tier.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  Rp {tier.price.toLocaleString('id-ID')}
                </span>
                <span className="text-slate-400">/year</span>
              </div>
              <p className="text-slate-400 mb-6">
                {tier.description}
              </p>

              <Link
                href={`/checkout/${tier.id}`}
                className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-center mb-6"
              >
                Buy Now
              </Link>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Includes:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Daily video updates
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Exclusive Telegram group
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Source code access
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
