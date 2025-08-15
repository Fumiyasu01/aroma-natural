'use client'

import { FaWifi, FaHome } from 'react-icons/fa'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-gray)] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaWifi className="text-4xl text-gray-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
          オフラインです
        </h1>
        
        <p className="text-[var(--text-light)] mb-8">
          インターネット接続がありません。<br />
          接続を確認してもう一度お試しください。
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="bg-[var(--primary)] text-white rounded-full px-8 py-3 font-medium mb-4"
        >
          再読み込み
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="text-[var(--primary)] font-medium flex items-center justify-center mx-auto"
        >
          <FaHome className="mr-2" />
          ホームに戻る
        </button>
      </div>
    </div>
  )
}