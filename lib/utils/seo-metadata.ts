import { Icon } from '@/lib/types'

/**
 * SEO Metadata 配置常量
 */
export const SEO_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptologo.org',
  siteName: 'Cryptologo',
  formatInfo: 'High quality raster (.PNG) and vector (.SVG) logo files',
} as const

/**
 * 生成代币的符号显示格式
 * @param icon 图标对象
 * @returns 格式化的符号字符串，如 " (BTC)" 或 ""
 */
export function getSymbolDisplay(icon: Icon): string {
  return icon.symbol ? ` (${icon.symbol})` : ''
}

/**
 * 生成完整的标题格式
 * @param icon 图标对象
 * @param includeFormat 是否包含格式信息（.SVG and .PNG Files Free Download）
 * @returns 格式化的标题
 */
export function generateTitle(icon: Icon, includeFormat: boolean = true): string {
  const symbol = getSymbolDisplay(icon)
  const formatSuffix = includeFormat ? ' Logo .SVG and .PNG Files Free Download' : ' Logo'
  return `${icon.name}${symbol}${formatSuffix} - ${SEO_CONFIG.siteName}`
}

/**
 * 生成 SEO 描述
 * @param icon 图标对象
 * @returns 格式化的描述字符串
 * 格式：Free download {缩写} logo in multi-size formats. Official website: {官网}
 */
export function generateDescription(icon: Icon): string {
  // 使用缩写，如果没有缩写则使用代币名称
  const symbol = icon.symbol || icon.name
  
  // 格式：Free download {缩写} logo in multi-size formats. Official website: {官网}
  const websiteInfo = icon.website ? ` Official website: ${icon.website}` : ''
  
  return `Free download ${symbol} logo in multi-size formats.${websiteInfo}`
}

/**
 * 生成图标 URL
 * @param iconId 图标 ID
 * @returns 完整的图标页面 URL
 */
export function getIconUrl(iconId: string): string {
  return `${SEO_CONFIG.baseUrl}/icon/${iconId}`
}

/**
 * 生成图标图片 URL
 * @param svgPath SVG 路径
 * @returns 完整的图片 URL
 */
export function getImageUrl(svgPath: string): string {
  return `${SEO_CONFIG.baseUrl}${svgPath}`
}

/**
 * 生成结构化数据 (JSON-LD)
 * @param icon 图标对象
 * @returns 结构化数据对象
 */
export function generateStructuredData(icon: Icon) {
  const symbol = getSymbolDisplay(icon)
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: `${icon.name}${symbol} Logo`,
    description: icon.description || `${icon.name} cryptocurrency logo`,
    image: {
      '@type': 'ImageObject',
      url: getImageUrl(icon.svgPath),
      encodingFormat: 'image/svg+xml',
      contentUrl: getImageUrl(icon.svgPath),
    },
    encodingFormat: ['image/svg+xml', 'image/png'],
    about: {
      '@type': 'Thing',
      name: icon.name,
      alternateName: icon.symbol,
      identifier: icon.symbol || icon.id,
      ...(icon.website ? { url: icon.website } : {}),
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    ...(icon.website ? {
      mainEntityOfPage: {
        '@type': 'WebPage',
        url: icon.website,
      },
    } : {}),
  }
}

