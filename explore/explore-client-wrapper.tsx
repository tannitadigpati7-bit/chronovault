'use client'

import { useRouter } from 'next/navigation'
import { GhostCharacter } from '@/components/ghost/ghost-character'

export function ExploreClientWrapper() {
  const router = useRouter()
  
  return (
    <GhostCharacter onInteract={() => router.push('/curator')} />
  )
}
