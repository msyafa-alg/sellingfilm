# Features Section Component

import { Check, Code, Video, BookOpen, Users } from 'lucide-react'

const features = [
  {
    icon: Video,
    title: 'Daily Video Updates',
    description: 'New programming tutorials and walkthroughs added daily to keep you learning.',
  },
  {
    icon: Code,
    title: 'Hands-on Projects',
    description: 'Build real-world applications with guided coding exercises and projects.',
  },
  {
    icon: Users,
    title: 'Exclusive Community',
    description: 'Join our Telegram group to connect with fellow programmers and get help.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Curriculum',
    description: 'Learn from beginner to advanced topics with structured learning paths.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Join Lordarky?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get everything you need to master modern programming and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
