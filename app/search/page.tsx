'use client'

import { FaSearch, FaComments, FaBook, FaFlask, FaStethoscope } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function SearchPage() {
  const router = useRouter()
  
  const menuItems = [
    { icon: FaStethoscope, label: '症状から探す', color: 'var(--success)', href: '/search/symptoms' },
    { icon: FaComments, label: 'AI相談', color: 'var(--primary)', href: '/search/ai-consult' },
    { icon: FaFlask, label: 'レシピ集', color: 'var(--pink)', href: '/search/recipes' },
    { icon: FaBook, label: 'アロマ辞典', color: 'var(--action)', href: '/search/dictionary' },
  ]

  const popularTags = [
    '不眠', 'ストレス', '頭痛', 'リラックス', '集中力', 
    '花粉症', '冷え性', 'PMS', '風邪予防', '美肌'
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <header className="safe-top bg-white shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-[var(--text-dark)]">
            探す
          </h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center mb-6">
          <FaSearch className="text-[var(--text-light)] mr-3" />
          <input
            type="text"
            placeholder="アロマや症状を検索"
            className="flex-1 outline-none text-[var(--text-dark)]"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-[var(--text-dark)] mb-3">
            人気の相談タグ
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-[var(--text-dark)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon 
                  className="text-3xl mb-3 mx-auto" 
                  style={{ color: item.color }}
                />
                <p className="text-sm font-bold text-[var(--text-dark)]">
                  {item.label}
                </p>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}