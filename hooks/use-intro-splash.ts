'use client'

import { useEffect, useState } from 'react'

export function useIntroSplash() {
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('chrono-vault-intro-seen')
    if (!hasSeenIntro) {
      setShowIntro(true)
      localStorage.setItem('chrono-vault-intro-seen', 'true')
    }
  }, [])

  const dismiss = () => {
    setShowIntro(false)
  }

  return { showIntro, dismiss }
}
