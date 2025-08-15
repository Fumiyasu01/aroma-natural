'use client'

import { useState, useEffect } from 'react'
import { FaArrowLeft, FaPlus, FaCheck, FaShoppingCart, FaTint } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import aromaData from '@/data/aromas.json'

export default function MyAromasPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [ownedAromas, setOwnedAromas] = useState<string[]>([])
  const [wishlistAromas, setWishlistAromas] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'owned' | 'wishlist'>('owned')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.access_token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setOwnedAromas(data.profile.owned_aromas || [])
            setWishlistAromas(data.profile.preferences?.wishlist || [])
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session])

  const updateAromas = async () => {
    if (!session?.access_token) return

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          owned_aromas: ownedAromas,
          preferences: { wishlist: wishlistAromas }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to update aromas:', error)
    }
  }

  const toggleOwnedAroma = (aromaId: string) => {
    setOwnedAromas(prev => {
      const newOwned = prev.includes(aromaId)
        ? prev.filter(id => id !== aromaId)
        : [...prev, aromaId]
      
      // ウィッシュリストから削除（持っているならウィッシュリストには不要）
      if (newOwned.includes(aromaId)) {
        setWishlistAromas(current => current.filter(id => id !== aromaId))
      }
      
      return newOwned
    })
  }

  const toggleWishlistAroma = (aromaId: string) => {
    // すでに持っている場合はウィッシュリストに追加しない
    if (ownedAromas.includes(aromaId)) return
    
    setWishlistAromas(prev =>
      prev.includes(aromaId)
        ? prev.filter(id => id !== aromaId)
        : [...prev, aromaId]
    )
  }

  useEffect(() => {
    if (!loading) {
      updateAromas()
    }
  }, [ownedAromas, wishlistAromas])

  const filteredAromas = activeTab === 'owned'
    ? aromaData.aromas.filter(aroma => ownedAromas.includes(aroma.id))
    : aromaData.aromas.filter(aroma => wishlistAromas.includes(aroma.id))

  const allAromas = aromaData.aromas

  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <Header />

      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[var(--primary)] mb-3"
          >
            <FaArrowLeft className="mr-2" />
            戻る
          </button>
          <h1 className="text-xl font-bold text-[var(--text-dark)]">
            手持ちアロマ管理
          </h1>
        </div>

        <div className="flex border-t border-gray-100">
          <button
            onClick={() => setActiveTab('owned')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'owned'
                ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                : 'text-[var(--text-light)]'
            }`}
          >
            持っている ({ownedAromas.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'wishlist'
                ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                : 'text-[var(--text-light)]'
            }`}
          >
            欲しい ({wishlistAromas.length})
          </button>
        </div>
      </div>

      <main className="px-4 py-6">
        {activeTab === 'owned' && (
          <div className="mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[var(--text-dark)]">
                  コレクション進捗
                </h3>
                <span className="text-sm text-[var(--text-light)]">
                  {ownedAromas.length} / {allAromas.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[var(--primary)] h-2 rounded-full transition-all"
                  style={{ width: `${(ownedAromas.length / allAromas.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {filteredAromas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <FaTint className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-[var(--text-light)] mb-4">
              {activeTab === 'owned' 
                ? 'まだ登録されたアロマがありません'
                : 'ウィッシュリストは空です'}
            </p>
            <button
              onClick={() => setActiveTab('owned')}
              className="text-[var(--primary)] font-medium"
            >
              アロマを追加する
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredAromas.map((aroma) => (
              <div
                key={aroma.id}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ backgroundColor: aroma.color }}
                  />
                  <FaCheck className="text-[var(--success)]" />
                </div>
                <h4 className="font-bold text-[var(--text-dark)] mb-1">
                  {aroma.name_ja}
                </h4>
                <p className="text-xs text-[var(--text-light)]">
                  {aroma.category}
                </p>
                <div className="mt-2">
                  <p className="text-xs text-[var(--text-dark)]">
                    {aroma.effects.slice(0, 2).join('・')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-bold text-[var(--text-dark)] mb-4">
            {activeTab === 'owned' ? 'アロマを追加' : 'すべてのアロマ'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {allAromas.map((aroma) => {
              const isOwned = ownedAromas.includes(aroma.id)
              const isWishlisted = wishlistAromas.includes(aroma.id)
              
              return (
                <div
                  key={aroma.id}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: aroma.color }}
                    />
                    <div className="flex gap-2">
                      {activeTab === 'owned' ? (
                        <button
                          onClick={() => toggleOwnedAroma(aroma.id)}
                          className={`p-2 rounded-full transition-colors ${
                            isOwned
                              ? 'bg-[var(--success)] text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <FaCheck className="text-sm" />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleWishlistAroma(aroma.id)}
                          disabled={isOwned}
                          className={`p-2 rounded-full transition-colors ${
                            isOwned
                              ? 'bg-gray-100 text-gray-300'
                              : isWishlisted
                              ? 'bg-[var(--pink)] text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <FaShoppingCart className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--text-dark)] mb-1">
                    {aroma.name_ja}
                  </h4>
                  <p className="text-xs text-[var(--text-light)]">
                    {aroma.category}
                  </p>
                  {isOwned && activeTab === 'wishlist' && (
                    <p className="text-xs text-[var(--success)] mt-2">
                      すでに所有しています
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}