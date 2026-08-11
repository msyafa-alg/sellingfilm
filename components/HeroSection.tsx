# Hero Section Component

import Link from 'next/link'
import { BookOpen, Code, Trophy, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Master Programming with
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {' '}Lordarky
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Premium video course platform for programmers. Learn modern web development, 
          backend systems, and deployment strategies with expert guidance.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#pricing"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-600/25"
          >
            View Courses
          </Link>
          <Link
            href="#curriculum"
            className="px-8 py-4 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold rounded-lg transition-all"
          >
            Explore Curriculum
          </Link>
        </div>
      </div>
    </section>
  )
}
