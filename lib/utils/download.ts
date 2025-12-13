export async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch file')
    
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Download failed:', error)
    alert('Failed to download file. Please try again.')
  }
}

export function downloadSVG(svgPath: string, iconName: string) {
  const filename = `${iconName.toLowerCase().replace(/\s+/g, '-')}.svg`
  downloadFile(svgPath, filename)
}

export function downloadPNG(pngPath: string, iconName: string, size: number) {
  const filename = `${iconName.toLowerCase().replace(/\s+/g, '-')}-${size}.png`
  const pngUrl = `${pngPath}/${size}.png`
  downloadFile(pngUrl, filename)
}

