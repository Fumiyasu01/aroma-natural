'use client'

import { useEffect } from 'react'
import InstallPrompt from './InstallPrompt'
import NotificationPrompt from './NotificationPrompt'
import ToastProvider from './ToastProvider'
import ErrorBoundary from './ErrorBoundary'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Service Workerの登録
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  return (
    <ErrorBoundary>
      {children}
      <ToastProvider />
      <InstallPrompt />
      <NotificationPrompt />
    </ErrorBoundary>
  )
}