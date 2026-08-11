# Landing Page

import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import PricingSection from '@/components/PricingSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>

      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500">
            &copy; 2026 Lordarky. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
