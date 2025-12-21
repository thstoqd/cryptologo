'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import iconsMetadata from '@/data/icons-metadata.json'
import { Category, Icon } from '@/lib/types'

// Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojawzgz'

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    email: '',
    tokenName: '',
    tokenSymbol: '',
    website: '',
    description: '',
    svgLink: '',
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const categories = iconsMetadata.categories as Category[]
  const existingIcons = iconsMetadata.icons as Icon[]

  // 检查重复代币
  const checkDuplicate = (symbol: string, name: string): boolean => {
    return existingIcons.some(
      (icon) =>
        icon.symbol?.toLowerCase() === symbol.toLowerCase() ||
        icon.name.toLowerCase() === name.toLowerCase()
    )
  }

  // 验证 URL 格式
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // 处理分类选择
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // 取消选择
        return prev.filter((id) => id !== categoryId)
      } else {
        // 添加选择（最多3个）
        if (prev.length >= 3) {
          return prev
        }
        return [...prev, categoryId]
      }
    })
    // 清除分类错误
    if (errors.category) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.category
        return newErrors
      })
    }
  }

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.tokenName.trim()) {
      newErrors.tokenName = 'Token name is required'
    }

    if (!formData.tokenSymbol.trim()) {
      newErrors.tokenSymbol = 'Token symbol is required'
    } else {
      // 检查重复
      if (checkDuplicate(formData.tokenSymbol, formData.tokenName)) {
        newErrors.tokenSymbol = 'This token already exists'
      }
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL'
    }

    if (selectedCategories.length === 0) {
      newErrors.category = 'Please select at least one category'
    }

    if (!formData.svgLink.trim()) {
      newErrors.svgLink = 'SVG logo link is required'
    } else if (!isValidUrl(formData.svgLink)) {
      newErrors.svgLink = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // 准备提交数据
      const selectedCategoryNames = selectedCategories
        .map((id) => {
          const category = categories.find((cat) => cat.id === id)
          return category?.name || id
        })
        .join(', ')

      const submissionData = {
        email: formData.email,
        tokenName: formData.tokenName,
        tokenSymbol: formData.tokenSymbol,
        website: formData.website || 'Not provided',
        category: selectedCategoryNames,
        description: formData.description || 'Not provided',
        svgLink: formData.svgLink,
        submittedAt: new Date().toISOString(),
      }

      // 提交到 Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        // 重置表单
        setFormData({
          email: '',
          tokenName: '',
          tokenSymbol: '',
          website: '',
          description: '',
          svgLink: '',
        })
        setSelectedCategories([])
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to submit. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 成功页面
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Success!
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Thank you for your submission!
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Token:</span>{' '}
                  {formData.tokenName} ({formData.tokenSymbol})
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span> {formData.email}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                We&apos;ll review your submission and get back to you soon.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submit New Token
          </h1>
          <p className="text-gray-600">
            Help us expand our cryptocurrency icon library
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="inline-flex items-center">
                📧 Your Email <span className="text-red-500 ml-1">*</span>
              </span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.email
                    return newErrors
                  })
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Token Name */}
          <div>
            <label
              htmlFor="tokenName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="inline-flex items-center">
                🪙 Token Name <span className="text-red-500 ml-1">*</span>
              </span>
            </label>
            <input
              type="text"
              id="tokenName"
              value={formData.tokenName}
              onChange={(e) => {
                setFormData({ ...formData, tokenName: e.target.value })
                if (errors.tokenName) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.tokenName
                    return newErrors
                  })
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.tokenName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Bitcoin"
            />
            {errors.tokenName && (
              <p className="mt-1 text-sm text-red-600">{errors.tokenName}</p>
            )}
          </div>

          {/* Token Symbol */}
          <div>
            <label
              htmlFor="tokenSymbol"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="inline-flex items-center">
                💎 Token Symbol <span className="text-red-500 ml-1">*</span>
              </span>
            </label>
            <input
              type="text"
              id="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={(e) => {
                setFormData({ ...formData, tokenSymbol: e.target.value })
                if (errors.tokenSymbol) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.tokenSymbol
                    return newErrors
                  })
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.tokenSymbol ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="BTC"
            />
            {errors.tokenSymbol && (
              <p className="mt-1 text-sm text-red-600">{errors.tokenSymbol}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="inline-flex items-center">
                🌐 Official Website{' '}
                <span className="text-gray-500 text-xs ml-2">(Optional)</span>
              </span>
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => {
                setFormData({ ...formData, website: e.target.value })
                if (errors.website) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.website
                    return newErrors
                  })
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.website ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://bitcoin.org"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-flex items-center">
                📁 Category <span className="text-red-500 ml-1">*</span>
                {selectedCategories.length > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({selectedCategories.length}/3 selected)
                  </span>
                )}
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id)
                const isDisabled =
                  !isSelected && selectedCategories.length >= 3
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </button>
                )
              })}
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
            {selectedCategories.length >= 3 && (
              <p className="mt-2 text-xs text-gray-500">
                Maximum 3 categories selected
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="inline-flex items-center">
                📝 Description{' '}
                <span className="text-gray-500 text-xs ml-2">(Optional)</span>
              </span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Bitcoin (BTC) - The first decentralized cryptocurrency"
            />
          </div>

          {/* SVG Link */}
          <div>
            <label
              htmlFor="svgLink"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <span className="inline-flex items-center">
                🎨 SVG Logo Link <span className="text-red-500 ml-1">*</span>
              </span>
            </label>
            <input
              type="url"
              id="svgLink"
              value={formData.svgLink}
              onChange={(e) => {
                setFormData({ ...formData, svgLink: e.target.value })
                if (errors.svgLink) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.svgLink
                    return newErrors
                  })
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.svgLink ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/logo.svg"
            />
            {errors.svgLink && (
              <p className="mt-1 text-sm text-red-600">{errors.svgLink}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              ⚠️ Please provide a direct, downloadable SVG link
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Token'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}

