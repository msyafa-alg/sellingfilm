# Header Component

import Link from 'next/link'
import { User, LogOut } from 'lucide-react'

export default async function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          Lordarky
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  )
}
