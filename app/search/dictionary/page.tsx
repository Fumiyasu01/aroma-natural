'use client'

import { useState } from 'react'
import { FaArrowLeft, FaSearch, FaTint, FaExclamationTriangle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import aromaData from '@/data/aromas.json'

export default function DictionaryPage() {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const [selectedAroma, setSelectedAroma] = useState<typeof aromaData.aromas[0] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'すべて' },
    { id: 'フローラル系', label: 'フローラル' },
    { id: '柑橘系', label: '柑橘' },
    { id: 'ハーブ系', label: 'ハーブ' },
    { id: '樹木系', label: '樹木' },
  ]

  const filteredAromas = aromaData.aromas.filter(aroma => {
    const matchesSearch = aroma.name_ja.toLowerCase().includes(searchText.toLowerCase()) ||
                          aroma.name_en.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || aroma.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getBlendWellAromas = (aromaIds: string[]) => {
    return aromaIds.map(id => aromaData.aromas.find(a => a.id === id)).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <Header />

      <div className="bg-white shadow-sm px-4 py-3">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[var(--primary)] mb-3"
        >
          <FaArrowLeft className="mr-2" />
          戻る
        </button>
        <h2 className="text-xl font-bold text-[var(--text-dark)] mb-3">
          アロマ辞典
        </h2>
        
        <div className="relative mb-3">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-light)]" />
          <input
            type="text"
            placeholder="アロマ名で検索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-gray)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-gray-100 text-[var(--text-dark)] hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 py-6">
        {selectedAroma ? (
          <div>
            <button
              onClick={() => setSelectedAroma(null)}
              className="text-[var(--primary)] text-sm mb-4"
            >
              ← 一覧に戻る
            </button>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-dark)]">
                    {selectedAroma.name_ja}
                  </h3>
                  <p className="text-sm text-[var(--text-light)]">
                    {selectedAroma.name_en} / {selectedAroma.category}
                  </p>
                </div>
                <div
                  className="w-16 h-16 rounded-full"
                  style={{ backgroundColor: selectedAroma.color }}
                />
              </div>

              <p className="text-[var(--text-dark)] mb-4">
                {selectedAroma.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-dark)] mb-2">
                    効果・効能
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAroma.effects.map((effect) => (
                      <span
                        key={effect}
                        className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--text-dark)] mb-2">
                    こんな時におすすめ
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAroma.symptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="px-3 py-1 bg-gray-100 text-[var(--text-dark)] rounded-full text-xs"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--text-dark)] mb-2">
                    使い方
                  </h4>
                  <div className="bg-[var(--bg-gray)] rounded-xl p-3 space-y-2">
                    <div className="flex items-center">
                      <FaTint className="text-[var(--primary)] mr-2 text-sm" />
                      <span className="text-sm">
                        ディフューザー: {selectedAroma.usage.diffuser}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaTint className="text-[var(--primary)] mr-2 text-sm" />
                      <span className="text-sm">
                        お風呂: {selectedAroma.usage.bath}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaTint className="text-[var(--primary)] mr-2 text-sm" />
                      <span className="text-sm">
                        マッサージ: {selectedAroma.usage.massage}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--text-dark)] mb-2">
                    相性の良いアロマ
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getBlendWellAromas(selectedAroma.blend_well).map((aroma) => (
                      aroma && (
                        <button
                          key={aroma.id}
                          onClick={() => setSelectedAroma(aroma)}
                          className="flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-[var(--primary)] transition-colors"
                        >
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: aroma.color }}
                          />
                          {aroma.name_ja}
                        </button>
                      )
                    ))}
                  </div>
                </div>

                {selectedAroma.cautions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-red-500 mb-2 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      注意事項
                    </h4>
                    <div className="bg-red-50 rounded-xl p-3">
                      <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        {selectedAroma.cautions.map((caution, index) => (
                          <li key={index}>{caution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-[var(--text-light)]">
                    価格帯: ¥{selectedAroma.price_range}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    selectedAroma.difficulty === 'beginner' 
                      ? 'bg-green-100 text-green-700'
                      : selectedAroma.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedAroma.difficulty === 'beginner' ? '初心者向け' :
                     selectedAroma.difficulty === 'intermediate' ? '中級者向け' : '上級者向け'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredAromas.map((aroma) => (
              <button
                key={aroma.id}
                onClick={() => setSelectedAroma(aroma)}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: aroma.color }}
                  />
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    aroma.difficulty === 'beginner' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {aroma.difficulty === 'beginner' && '初心者'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[var(--text-dark)] mb-1">
                  {aroma.name_ja}
                </h4>
                <p className="text-xs text-[var(--text-light)]">
                  {aroma.category}
                </p>
                <div className="mt-2">
                  <p className="text-xs text-[var(--text-dark)] line-clamp-2">
                    {aroma.effects.slice(0, 2).join('・')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}