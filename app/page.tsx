'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Sidebar from '@/components/Sidebar'
import IconGrid from '@/components/IconGrid'
import Footer from '@/components/Footer'
import { useIcons } from '@/lib/context/IconContext'

export default function Home() {
  const searchParams = useSearchParams()
  const { setSelectedCategory } = useIcons()

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams, setSelectedCategory])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">
          <IconGrid />
        </main>
      </div>
      <Footer />
    </div>
  )
}
