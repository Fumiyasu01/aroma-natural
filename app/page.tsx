'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaStar, FaHistory, FaFire, FaComments, FaBook, FaFlask, FaStethoscope } from 'react-icons/fa'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MoodSelector from '@/components/MoodSelector'
import Header from '@/components/Header'
import ProfileSetupModal from '@/components/ProfileSetupModal'
import AnimatedCard from '@/components/AnimatedCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { useHaptic } from '@/hooks/useHaptic'
import aromaData from '@/data/aromas.json'

export default function Home() {
  const router = useRouter()
  const { user, session } = useAuth()
  const { vibrate } = useHaptic()
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const today = new Date()
  const formattedDate = today.toLocaleDateString('ja-JP', { 
    month: 'long', 
    day: 'numeric', 
    weekday: 'short' 
  })

  // プロフィールをチェック
  useEffect(() => {
    const checkProfile = async () => {
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
          if (!data.profile) {
            // プロフィールが存在しない場合は設定モーダルを表示
            setShowProfileSetup(true)
          } else {
            setUserProfile(data.profile)
            toast.success(`おかえりなさい、${data.profile.nickname}さん！`)
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast.error('プロフィールの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      checkProfile()
    } else {
      setLoading(false)
    }
  }, [user, session])
  
  const greeting = () => {
    const hour = today.getHours()
    if (hour < 5) return 'こんばんは'
    if (hour < 10) return 'おはようございます'
    if (hour < 18) return 'こんにちは'
    return 'こんばんは'
  }

  const getGreetingWithName = () => {
    const base = greeting()
    if (userProfile?.nickname) {
      return `${base}、${userProfile.nickname}さん`
    }
    return base
  }

  const popularAromas = aromaData.aromas
    .filter(a => a.difficulty === 'beginner')
    .slice(0, 3)
  
  const menuItems = [
    { icon: FaStethoscope, label: '症状から探す', color: 'var(--success)', href: '/search/symptoms' },
    { icon: FaComments, label: 'AI相談', color: 'var(--primary)', href: '/search/ai-consult' },
    { icon: FaFlask, label: 'レシピ集', color: 'var(--pink)', href: '/search/recipes' },
    { icon: FaBook, label: 'アロマ辞典', color: 'var(--action)', href: '/search/dictionary' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-gray)] flex items-center justify-center">
        <LoadingSpinner size="large" message="読み込み中..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <Header />

      <main className="px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-[var(--text-light)]">{formattedDate}</p>
          <h2 className="text-2xl font-bold text-[var(--text-dark)] mt-1">
            {getGreetingWithName()}
          </h2>
        </div>
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            vibrate('medium')
            setShowMoodSelector(true)
          }}
          className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--pink)] text-white rounded-3xl py-6 px-8 shadow-lg"
        >
          <div className="flex items-center justify-center">
            <FaStar className="text-2xl mr-3" />
            <span className="text-xl font-bold">今日の気分を選ぶ</span>
          </div>
          <p className="text-sm mt-2 opacity-90">
            あなたに合ったアロマを提案します
          </p>
        </motion.button>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--text-dark)]">
              最近の提案
            </h2>
            <button className="text-[var(--primary)] text-sm">
              すべて見る
            </button>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center">
              <FaHistory className="text-[var(--text-light)] mr-3" />
              <p className="text-[var(--text-light)]">
                まだ提案履歴がありません
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center mb-4">
            <FaFire className="text-[var(--action)] mr-2" />
            <h2 className="text-lg font-bold text-[var(--text-dark)]">
              人気のアロマ TOP3
            </h2>
          </div>
          <div className="space-y-3">
            {popularAromas.map((aroma, index) => (
              <AnimatedCard
                key={aroma.id}
                delay={index * 0.1}
                className="flex items-center cursor-pointer"
                onClick={() => {
                  vibrate('light')
                  router.push('/search/dictionary')
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4"
                  style={{ backgroundColor: aroma.color }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--text-dark)]">
                    {aroma.name_ja}
                  </h3>
                  <p className="text-sm text-[var(--text-light)]">
                    {aroma.effects.slice(0, 3).join('・')}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-[var(--text-dark)] mb-4">
            探す・相談する
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Icon 
                    className="text-2xl mb-2 mx-auto" 
                    style={{ color: item.color }}
                  />
                  <p className="text-sm font-medium text-[var(--text-dark)]">
                    {item.label}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {showMoodSelector && (
        <MoodSelector onClose={() => setShowMoodSelector(false)} />
      )}

      {showProfileSetup && (
        <ProfileSetupModal
          onComplete={(profile) => {
            setUserProfile(profile)
            setShowProfileSetup(false)
          }}
          isInitialSetup={true}
        />
      )}
    </div>
  )
}