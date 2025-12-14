'use client'

import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Sidebar from '@/components/Sidebar'
import IconGrid from '@/components/IconGrid'
import Footer from '@/components/Footer'
import HomeContent from '@/components/HomeContent'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Suspense fallback={
        <div className="flex flex-1">
          <div className="w-64 lg:w-72" />
          <main className="flex-1 p-4 sm:p-6 lg:ml-0">
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          </main>
        </div>
      }>
        <HomeContent />
      </Suspense>
      <Footer />
    </div>
  )
}
