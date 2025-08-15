'use client'

import { useState } from 'react'
import { FaTimes, FaCamera } from 'react-icons/fa'
import aromaData from '@/data/aromas.json'

interface RecordModalProps {
  date: Date
  onClose: () => void
  onSave: (record: any) => void
}

export default function RecordModal({ date, onClose, onSave }: RecordModalProps) {
  const [selectedAromas, setSelectedAromas] = useState<string[]>([])
  const [moodBefore, setMoodBefore] = useState(3)
  const [moodAfter, setMoodAfter] = useState(3)
  const [usageMethod, setUsageMethod] = useState('diffuser')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'planned' | 'completed'>('completed')

  const toggleAroma = (aromaId: string) => {
    setSelectedAromas(prev =>
      prev.includes(aromaId)
        ? prev.filter(id => id !== aromaId)
        : [...prev, aromaId]
    )
  }

  const handleSave = () => {
    const record = {
      date: date.toISOString().split('T')[0],
      status,
      selected_aromas: selectedAromas,
      used_aromas: status === 'completed' ? selectedAromas : [],
      mood_before: moodBefore,
      mood_after: status === 'completed' ? moodAfter : undefined,
      usage_method: usageMethod,
      notes,
    }
    onSave(record)
    onClose()
  }

  const moodEmojis = ['😔', '😕', '😐', '🙂', '😊']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-h-[90vh] rounded-t-3xl animate-slide-up overflow-hidden">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-dark)]">
              記録を追加
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-[var(--text-light)] mt-1">
            {date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
          </p>
        </div>

        <div className="p-4 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div className="mb-6">
            <label className="text-sm font-bold text-[var(--text-dark)] mb-2 block">
              記録タイプ
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('planned')}
                className={`flex-1 py-2 px-4 rounded-full border-2 ${
                  status === 'planned'
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                    : 'border-gray-200'
                }`}
              >
                使用予定
              </button>
              <button
                onClick={() => setStatus('completed')}
                className={`flex-1 py-2 px-4 rounded-full border-2 ${
                  status === 'completed'
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                    : 'border-gray-200'
                }`}
              >
                使用完了
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-bold text-[var(--text-dark)] mb-2 block">
              使用アロマ（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {aromaData.aromas.slice(0, 10).map((aroma) => (
                <button
                  key={aroma.id}
                  onClick={() => toggleAroma(aroma.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-colors ${
                    selectedAromas.includes(aroma.id)
                      ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: aroma.color }}
                    />
                    <span className="text-sm font-medium text-[var(--text-dark)]">
                      {aroma.name_ja}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-bold text-[var(--text-dark)] mb-2 block">
              使用前の気分
            </label>
            <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setMoodBefore(index + 1)}
                  className={`text-2xl p-2 rounded-full transition-all ${
                    moodBefore === index + 1
                      ? 'bg-white shadow-md scale-110'
                      : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {status === 'completed' && (
            <div className="mb-6">
              <label className="text-sm font-bold text-[var(--text-dark)] mb-2 block">
                使用後の気分
              </label>
              <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
                {moodEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setMoodAfter(index + 1)}
                    className={`text-2xl p-2 rounded-full transition-all ${
                      moodAfter === index + 1
                        ? 'bg-white shadow-md scale-110'
                        : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="text-sm font-bold text-[var(--text-dark)] mb-2 block">
              使用方法
            </label>
            <select
              value={usageMethod}
              onChange={(e) => setUsageMethod(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="diffuser">ディフューザー</option>
              <option value="bath">お風呂</option>
              <option value="massage">マッサージ</option>
              <option value="inhale">吸入</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="text-sm font-bold text-[var(--text-dark)] mb-2 block">
              メモ（任意）
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="感想や気づいたことなど"
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] resize-none"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-bold text-[var(--text-dark)] mb-2 block">
              写真（任意）
            </label>
            <button className="w-full p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <FaCamera className="text-3xl text-[var(--text-light)] mb-2" />
              <span className="text-sm text-[var(--text-light)]">
                タップして写真を追加
              </span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={selectedAromas.length === 0}
            className="w-full bg-[var(--primary)] text-white rounded-full py-3 font-medium disabled:opacity-50"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  )
}