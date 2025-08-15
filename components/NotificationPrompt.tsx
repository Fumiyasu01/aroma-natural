'use client'

import { useState, useEffect } from 'react'
import { FaBell, FaTimes } from 'react-icons/fa'

export default function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    // 通知権限の状態を確認
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      // まだ許可を求めていない場合、初回訪問から10秒後に表示
      if (Notification.permission === 'default') {
        const dismissed = localStorage.getItem('notification-prompt-dismissed')
        if (dismissed !== 'true') {
          setTimeout(() => {
            setShowPrompt(true)
          }, 10000)
        }
      }
    }
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        // Service Workerに通知を登録
        subscribeToNotifications()
      }
    }
    setShowPrompt(false)
  }

  const subscribeToNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        
        // プッシュ通知の購読
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
          )
        })

        // サーバーに購読情報を送信
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        })

        // ローカル通知のスケジューリング（デモ用）
        scheduleLocalNotification()
      } catch (error) {
        console.error('Failed to subscribe to notifications:', error)
      }
    }
  }

  const scheduleLocalNotification = () => {
    // 毎日19時に通知（デモ用）
    const now = new Date()
    const scheduled = new Date()
    scheduled.setHours(19, 0, 0, 0)
    
    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1)
    }
    
    const timeout = scheduled.getTime() - now.getTime()
    
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('アロマナチュラル', {
          body: '今日のアロマタイムはいかがですか？',
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png'
        })
      }
    }, timeout)
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const handleDismiss = () => {
    localStorage.setItem('notification-prompt-dismissed', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt || permission !== 'default') return null

  return (
    <div className="fixed top-safe left-0 right-0 px-4 z-40 animate-slide-down">
      <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-md mx-auto border border-gray-100 mt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center mr-3">
              <FaBell className="text-[var(--primary)] text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-dark)]">
                記録リマインダー
              </h3>
              <p className="text-xs text-[var(--text-light)]">
                毎日の記録を忘れずに
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

        <p className="text-sm text-[var(--text-dark)] mb-4">
          通知を有効にして、アロマの記録を習慣化しましょう
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 text-[var(--text-dark)] font-medium"
          >
            今はしない
          </button>
          <button
            onClick={requestPermission}
            className="flex-1 py-3 bg-[var(--primary)] text-white rounded-full font-medium flex items-center justify-center"
          >
            <FaBell className="mr-1" />
            通知を許可
          </button>
        </div>
      </div>
    </div>
  )
}