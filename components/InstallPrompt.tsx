'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaTimes, FaMobileAlt } from 'react-icons/fa'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // すでにインストール済みかチェック
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // 以前に拒否されている場合は表示しない
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed === 'true') {
      return
    }

    // iOSの検出
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      // iOSの場合は、初回訪問から3秒後に表示
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    } else {
      // Android/デスクトップの場合
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
      })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {})
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA installed')
      }
      
      setDeferredPrompt(null)
    }
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4 z-40 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-md mx-auto border border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mr-3">
              <FaMobileAlt className="text-[var(--primary)] text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-dark)]">
                アプリをインストール
              </h3>
              <p className="text-xs text-[var(--text-light)]">
                ホーム画面に追加して快適に
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-dark)]">
              インストール方法：
            </p>
            <ol className="text-sm text-[var(--text-dark)] space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>ブラウザ下部の共有ボタンをタップ</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>「ホーム画面に追加」を選択</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>「追加」をタップ</span>
              </li>
            </ol>
            <button
              onClick={handleDismiss}
              className="w-full py-3 text-[var(--primary)] font-medium"
            >
              わかりました
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 text-[var(--text-dark)] font-medium"
            >
              後で
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-3 bg-[var(--primary)] text-white rounded-full font-medium flex items-center justify-center"
            >
              <FaPlus className="mr-1" />
              インストール
            </button>
          </div>
        )}
      </div>
    </div>
  )
}