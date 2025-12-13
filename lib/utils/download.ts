export async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      if (response.status === 404) {
        alert(`File not found: ${filename}\n\nThe PNG file for this icon may not be available yet. Please check back later.`)
      } else {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
      }
      return
    }
    
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
    alert(`Failed to download file: ${filename}\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`)
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

