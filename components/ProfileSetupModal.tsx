'use client'

import { useState } from 'react'
import { FaTimes, FaUser, FaStar, FaHeart, FaCheck } from 'react-icons/fa'
import aromaData from '@/data/aromas.json'

interface ProfileSetupModalProps {
  onComplete: (profile: any) => void
  onClose?: () => void
  isInitialSetup?: boolean
}

export default function ProfileSetupModal({ onComplete, onClose, isInitialSetup = true }: ProfileSetupModalProps) {
  const [step, setStep] = useState(1)
  const [nickname, setNickname] = useState('')
  const [experienceLevel, setExperienceLevel] = useState<string>('')
  const [ownedAromas, setOwnedAromas] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])

  const experienceLevels = [
    { value: 'beginner', label: '初心者', description: 'アロマを始めたばかり' },
    { value: 'intermediate', label: '中級者', description: '数ヶ月〜1年程度' },
    { value: 'advanced', label: '上級者', description: '1年以上の経験' }
  ]

  const goalOptions = [
    { value: 'relaxation', label: 'リラックス', icon: '😌' },
    { value: 'sleep', label: '睡眠改善', icon: '😴' },
    { value: 'focus', label: '集中力向上', icon: '🎯' },
    { value: 'mood', label: '気分転換', icon: '😊' },
    { value: 'health', label: '健康維持', icon: '💪' },
    { value: 'beauty', label: '美容', icon: '✨' }
  ]

  const handleToggleAroma = (aromaId: string) => {
    setOwnedAromas(prev => 
      prev.includes(aromaId) 
        ? prev.filter(id => id !== aromaId)
        : [...prev, aromaId]
    )
  }

  const handleToggleGoal = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const handleComplete = async () => {
    const profile = {
      nickname,
      experience_level: experienceLevel,
      owned_aromas: ownedAromas,
      goals
    }

    try {
      const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        const data = await response.json()
        onComplete(data.profile)
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }

  const canProceed = () => {
    if (step === 1) return nickname.trim() !== ''
    if (step === 2) return experienceLevel !== ''
    if (step === 3) return true
    if (step === 4) return true  // 目的選択は任意
    return false
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md h-[85vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-dark)]">
            {isInitialSetup ? 'プロフィール設定' : 'プロフィール編集'}
          </h2>
          {!isInitialSetup && onClose && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <FaTimes className="text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-[var(--primary)] text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-dark)] mb-2">
                  ようこそ！
                </h3>
                <p className="text-sm text-[var(--text-light)]">
                  まずはニックネームを教えてください
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                  ニックネーム
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="例：アロマ好き太郎"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  maxLength={20}
                />
                <p className="text-xs text-[var(--text-light)] mt-1">
                  {nickname.length}/20文字
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-[var(--primary)] text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-dark)] mb-2">
                  アロマの経験
                </h3>
                <p className="text-sm text-[var(--text-light)]">
                  あなたの経験レベルを教えてください
                </p>
              </div>

              <div className="space-y-3">
                {experienceLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setExperienceLevel(level.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      experienceLevel === level.value
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-bold text-[var(--text-dark)]">
                          {level.label}
                        </p>
                        <p className="text-sm text-[var(--text-light)]">
                          {level.description}
                        </p>
                      </div>
                      {experienceLevel === level.value && (
                        <FaCheck className="text-[var(--primary)]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-[var(--text-dark)] mb-2">
                  持っているアロマ
                </h3>
                <p className="text-sm text-[var(--text-light)]">
                  お持ちのアロマを選択してください（スキップ可）
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {aromaData.aromas.map((aroma) => (
                  <button
                    key={aroma.id}
                    onClick={() => handleToggleAroma(aroma.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      ownedAromas.includes(aroma.id)
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: aroma.color }}
                      />
                      {ownedAromas.includes(aroma.id) && (
                        <FaCheck className="text-[var(--primary)] text-sm" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-[var(--text-dark)] text-left">
                      {aroma.name_ja}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="text-[var(--primary)] text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-dark)] mb-2">
                  アロマを使う目的
                </h3>
                <p className="text-sm text-[var(--text-light)]">
                  興味のある分野を選んでください（スキップ可）
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => handleToggleGoal(goal.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      goals.includes(goal.value)
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{goal.icon}</div>
                      <p className="text-sm font-medium text-[var(--text-dark)]">
                        {goal.label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setStep(step - 1)}
              className={`px-6 py-3 text-[var(--primary)] font-medium ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              戻る
            </button>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    s === step ? 'bg-[var(--primary)]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  canProceed()
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step === 3 ? 'スキップ' : '次へ'}
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  canProceed()
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                完了
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}