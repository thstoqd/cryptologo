'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Cryptologo"
              className="h-8 w-8"
            />
            <h1 className="text-2xl font-bold text-gray-900">Cryptologo</h1>
          </Link>
        </div>
      </div>
    </header>
  )
}

