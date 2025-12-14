'use client'

import Link from 'next/link'
import { useIcons } from '@/lib/context/IconContext'

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useIcons()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Cryptologo"
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
            <h1 className="text-base sm:text-lg font-semibold text-gray-900">Cryptologo</h1>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

