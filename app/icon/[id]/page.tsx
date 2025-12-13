import iconsMetadata from '@/data/icons-metadata.json'
import IconDetailPageClient from './IconDetailPageClient'

// Generate static params for all icons (required for static export)
export function generateStaticParams() {
  return iconsMetadata.icons.map((icon) => ({
    id: icon.id,
  }))
}

// This is a server component that wraps the client component
export default function IconDetailPage({ params }: { params: { id: string } }) {
  return <IconDetailPageClient id={params.id} />
}
