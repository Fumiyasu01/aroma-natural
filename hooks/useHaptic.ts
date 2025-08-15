'use client'

import { useCallback } from 'react'

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

export function useHaptic() {
  const vibrate = useCallback((type: HapticType = 'light') => {
    if (!('vibrate' in navigator)) return

    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 20, 10],
      warning: [20, 10, 20],
      error: [30, 10, 30, 10, 30]
    }

    try {
      navigator.vibrate(patterns[type])
    } catch (error) {
      console.log('Haptic feedback not supported')
    }
  }, [])

  return { vibrate }
}