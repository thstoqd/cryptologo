'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export function useUrlParams() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const getCategory = () => {
    return searchParams.get('category')
  }

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    router.push(`/?${params.toString()}`)
  }

  return { getCategory, setCategory }
}

