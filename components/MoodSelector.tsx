'use client'

import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import aromaData from '@/data/aromas.json'
import AromaRecommendation from './AromaRecommendation'

interface MoodSelectorProps {
  onClose: () => void
}

const currentMoods = [
  { id: 'stress', label: 'ストレスを感じる', emoji: '😰' },
  { id: 'tired', label: '疲れている', emoji: '😴' },
  { id: 'energetic', label: '元気いっぱい', emoji: '😊' },
]

const desiredMoods = [
  { id: 'relax', label: 'リラックスしたい', emoji: '🌱' },
  { id: 'energize', label: '元気を出したい', emoji: '⚡' },
  { id: 'focus', label: '集中したい', emoji: '🎯' },
]

export default function MoodSelector({ onClose }: MoodSelectorProps) {
  const [step, setStep] = useState(1)
  const [currentMood, setCurrentMood] = useState('')
  const [desiredMood, setDesiredMood] = useState('')
  const [showRecommendation, setShowRecommendation] = useState(false)
  const [recommendations, setRecommendations] = useState<any>(null)

  const handleCurrentMoodSelect = (moodId: string) => {
    setCurrentMood(moodId)
    setStep(2)
  }

  const handleDesiredMoodSelect = async (moodId: string) => {
    setDesiredMood(moodId)
    const recs = await getRecommendedAromas(moodId)
    setRecommendations(recs)
    setShowRecommendation(true)
  }

  const getRecommendedAromas = async (targetMood?: string) => {
    const mood = targetMood || desiredMood
    const { aromas, blends } = aromaData
    let recommended = []
    
    // プロフィールから手持ちアロマを取得
    let ownedAromaIds: string[] = []
    try {
      const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')
      if (session?.access_token) {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          ownedAromaIds = data.profile?.owned_aromas || []
        }
      }
    } catch (error) {
      console.error('Failed to fetch owned aromas:', error)
    }
    
    if (currentMood === 'stress' && mood === 'relax') {
      recommended = aromas.filter(a => 
        a.effects.includes('リラックス') || a.effects.includes('鎮静')
      )
    } else if (currentMood === 'tired' && mood === 'energize') {
      recommended = aromas.filter(a => 
        a.effects.includes('リフレッシュ') || a.effects.includes('気分転換')
      )
    } else if (mood === 'focus') {
      recommended = aromas.filter(a => 
        a.effects.includes('集中力向上') || a.effects.includes('記憶力向上')
      )
    } else {
      recommended = aromas.filter(a => a.difficulty === 'beginner')
    }
    
    // 手持ちアロマを優先的に推薦
    const ownedRecommendations = recommended.filter(a => ownedAromaIds.includes(a.id))
    const otherRecommendations = recommended.filter(a => !ownedAromaIds.includes(a.id))
    
    const sortedAromas = [...ownedRecommendations, ...otherRecommendations].slice(0, 3)
    const recommendedBlend = blends.find(b => 
      b.effects.some(e => 
        mood === 'relax' ? e.includes('リラックス') :
        mood === 'energize' ? e.includes('リフレッシュ') :
        e.includes('集中')
      )
    ) || blends[0]
    
    return { aromas: sortedAromas, blend: recommendedBlend }
  }

  if (showRecommendation && recommendations) {
    return (
      <AromaRecommendation 
        recommendations={recommendations}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl animate-slide-up">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-dark)]">
              {step === 1 ? '今の気分は？' : 'どうなりたい？'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 pb-8">
          {step === 1 ? (
            <div className="space-y-3">
              {currentMoods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleCurrentMoodSelect(mood.id)}
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center hover:border-[var(--primary)] transition-colors"
                >
                  <span className="text-3xl mr-4">{mood.emoji}</span>
                  <span className="text-lg font-medium text-[var(--text-dark)]">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {desiredMoods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleDesiredMoodSelect(mood.id)}
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center hover:border-[var(--primary)] transition-colors"
                >
                  <span className="text-3xl mr-4">{mood.emoji}</span>
                  <span className="text-lg font-medium text-[var(--text-dark)]">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}