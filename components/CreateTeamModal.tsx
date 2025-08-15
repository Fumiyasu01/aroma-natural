'use client'

import { useState } from 'react'
import { FaTimes, FaUsers, FaGlobe, FaLock } from 'react-icons/fa'

interface CreateTeamModalProps {
  onClose: () => void
  onCreate: (teamData: any) => void
}

export default function CreateTeamModal({ onClose, onCreate }: CreateTeamModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const handleSubmit = () => {
    if (!name.trim()) return

    onCreate({
      name: name.trim(),
      description: description.trim(),
      is_public: isPublic
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-dark)]">
            チームを作成
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
              チーム名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：アロマ愛好家の会"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              maxLength={30}
            />
            <p className="text-xs text-[var(--text-light)] mt-1">
              {name.length}/30文字
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
              説明（任意）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="チームの目的や活動内容を書きましょう"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              rows={3}
              maxLength={100}
            />
            <p className="text-xs text-[var(--text-light)] mt-1">
              {description.length}/100文字
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-dark)] mb-3">
              公開設定
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setIsPublic(true)}
                className={`w-full p-3 rounded-xl border-2 transition-all ${
                  isPublic
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <FaGlobe className={`mr-3 ${isPublic ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="font-medium text-[var(--text-dark)]">
                      公開チーム
                    </p>
                    <p className="text-xs text-[var(--text-light)]">
                      誰でも参加できます
                    </p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setIsPublic(false)}
                className={`w-full p-3 rounded-xl border-2 transition-all ${
                  !isPublic
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <FaLock className={`mr-3 ${!isPublic ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="font-medium text-[var(--text-dark)]">
                      プライベートチーム
                    </p>
                    <p className="text-xs text-[var(--text-light)]">
                      招待された人のみ参加可能
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-[var(--text-dark)] font-medium"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={`flex-1 py-3 rounded-full font-medium transition-colors ${
              name.trim()
                ? 'bg-[var(--primary)] text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            作成する
          </button>
        </div>
      </div>
    </div>
  )
}