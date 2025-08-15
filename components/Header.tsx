'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FaUser, FaCog, FaFlask, FaSignOutAlt, FaChevronDown, FaChartLine } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  const getPageTitle = () => {
    if (pathname === '/') return 'アロマライフ'
    if (pathname.startsWith('/records')) return '記録'
    if (pathname.startsWith('/teams')) return 'つながる'
    if (pathname.startsWith('/search')) return '探す'
    return 'アロマライフ'
  }

  const menuItems = [
    { icon: FaUser, label: 'プロフィール', href: '/profile' },
    { icon: FaFlask, label: '手持ちアロマ', href: '/profile/my-aromas' },
    { icon: FaChartLine, label: '使用分析', href: '/profile/analytics' },
    { icon: FaCog, label: '設定', href: '/profile/settings' },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="safe-top bg-white shadow-sm relative">
      <div className="px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--text-dark)]">
          {getPageTitle()}
        </h1>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 bg-[var(--primary-light)] rounded-full flex items-center justify-center"
          >
            {user ? (
              <span className="text-[var(--primary)] font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            ) : (
              <FaUser className="text-[var(--primary)]" />
            )}
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg z-50 w-48 overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-[var(--text-dark)]">
                        {user.email}
                      </p>
                    </div>
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            router.push(item.href)
                            setShowMenu(false)
                          }}
                          className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="text-[var(--text-light)] mr-3" />
                          <span className="text-[var(--text-dark)]">{item.label}</span>
                        </button>
                      )
                    })}
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      <FaSignOutAlt className="text-red-500 mr-3" />
                      <span className="text-red-500">ログアウト</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push('/login')
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-3 text-[var(--primary)] font-medium hover:bg-gray-50"
                    >
                      ログイン
                    </button>
                    <button
                      onClick={() => {
                        router.push('/signup')
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-3 text-[var(--text-dark)] hover:bg-gray-50 border-t border-gray-100"
                    >
                      新規登録
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}