# Dashboard Page

import { requireAuth } from '@/lib/supabase/auth'
import { createServerClientComponent } from '@/lib/supabase/server'
import { getSubscription } from '@/lib/supabase/db-actions'
import { redirect } from 'next/navigation'
import { Calendar, Clock, ArrowRight, Users, Mail, Check } from 'lucide-react'

export default async function DashboardPage() {
  const user = await requireAuth()

  const supabase = createServerClientComponent()
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(`
      *,
      tier:tier_id (*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!subscription) {
    redirect('/')
  }

  const tier = subscription.tier as any

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const expiryDate = new Date(subscription.expires_at!)
  const daysLeft = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {profile?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-400">
            Here's your membership overview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-green-600/20 text-green-500 rounded-full text-xs font-medium">
                      Active
                    </span>
                    <span className="text-slate-400">
                      {daysLeft} days remaining
                    </span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🎓</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Expires on</p>
                    <p className="text-white font-medium">
                      {expiryDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Joined on</p>
                    <p className="text-white font-medium">
                      {new Date(subscription.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-lg font-semibold mb-4">Ready to Learn?</h3>
              <p className="text-blue-100 text-sm mb-6">
                Access your exclusive Telegram group and start watching daily video updates.
              </p>
              
              <a
                href={tier.telegram_group_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors mb-4"
              >
                <Users className="w-5 h-5" />
                Join Telegram Group
              </a>

              <a
                href={`/course/${tier.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                Start Learning
              </a>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
          <h3 className="text-xl font-bold text-white mb-6">What's Included</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-white font-medium">Daily Video Updates</p>
                <p className="text-slate-400 text-sm">New programming tutorials added every day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-white font-medium">Exclusive Telegram Group</p>
                <p className="text-slate-400 text-sm">Connect with fellow programmers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💻</span>
              </div>
              <div>
                <p className="text-white font-medium">Source Code Access</p>
                <p className="text-slate-400 text-sm">All project source codes included</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <p className="text-white font-medium">Comprehensive Curriculum</p>
                <p className="text-slate-400 text-sm">From beginner to advanced topics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
