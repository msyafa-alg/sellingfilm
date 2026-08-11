# Course/Video Player Page

import { requireActiveSubscription } from '@/lib/supabase/auth'
import { createServerClientComponent } from '@/lib/supabase/server'
import { getTier } from '@/lib/supabase/db-actions'
import { Play, Video, Calendar, Clock } from 'lucide-react'

export default async function CoursePage({ params }: { params: { tierId: string } }) {
  await requireActiveSubscription(params.tierId)

  const tier = await getTier(params.tierId)
  
  if (!tier) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-7xl mx-auto px-4">Tier not found</div>
      </div>
    )
  }

  const sampleVideos = [
    {
      id: '1',
      title: 'Introduction to Modern Web Development',
      duration: '12:34',
      date: '2026-08-10',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Building Responsive Layouts with Tailwind CSS',
      duration: '24:15',
      date: '2026-08-09',
      isCompleted: true,
    },
    {
      id: '3',
      title: 'Next.js App Router: A Complete Guide',
      duration: '35:42',
      date: '2026-08-08',
      isCompleted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {tier.name} - Course Room
          </h1>
          <p className="text-slate-400">
            Access your exclusive programming video course
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white mx-auto mb-4 opacity-80" />
                  <p className="text-slate-400">Select a video to start learning</p>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  {sampleVideos[0].title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {sampleVideos[0].duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {sampleVideos[0].date}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Recent Videos
              </h3>
              <div className="space-y-3">
                {sampleVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {video.date}
                          </span>
                        </div>
                      </div>
                      {video.isCompleted && (
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-100">Course Progress</span>
                  <span>33%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full w-1/3" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-blue-100">Videos</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-blue-100">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Tier Benefits
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Daily video updates
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Exclusive Telegram group access
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Source code repository
                </li>
              </ul>
            </div>

            <a
              href={tier.telegram_group_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-center"
            >
              Join Telegram Group
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
