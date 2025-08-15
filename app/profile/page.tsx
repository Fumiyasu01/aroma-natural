'use client'

import { FaUser, FaFlask, FaBookmark, FaCog, FaQuestionCircle, FaSignOutAlt, FaChevronRight } from 'react-icons/fa'

export default function ProfilePage() {
  const menuItems = [
    { icon: FaFlask, label: '手持ちアロマ管理', href: '/profile/aromas' },
    { icon: FaBookmark, label: 'マイレシピ', href: '/profile/recipes' },
    { icon: FaCog, label: '設定', href: '/profile/settings' },
    { icon: FaQuestionCircle, label: 'ヘルプ', href: '/help' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <header className="safe-top bg-white shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-[var(--text-dark)]">
            マイページ
          </h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-[var(--primary-light)] rounded-full flex items-center justify-center mr-4">
              <FaUser className="text-3xl text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-dark)]">
                ゲストユーザー
              </h2>
              <p className="text-sm text-[var(--text-light)] mt-1">
                アロマ初心者
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-dark)]">0</p>
              <p className="text-xs text-[var(--text-light)]">使用日数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-dark)]">0</p>
              <p className="text-xs text-[var(--text-light)]">連続記録</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-dark)]">0</p>
              <p className="text-xs text-[var(--text-light)]">所有アロマ</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  <Icon className="text-[var(--text-light)] mr-3" />
                  <span className="text-[var(--text-dark)]">{item.label}</span>
                </div>
                <FaChevronRight className="text-[var(--text-light)] text-sm" />
              </button>
            )
          })}
        </div>

        <button className="w-full mt-6 py-4 text-red-500 font-medium flex items-center justify-center">
          <FaSignOutAlt className="mr-2" />
          ログアウト
        </button>
      </main>
    </div>
  )
}