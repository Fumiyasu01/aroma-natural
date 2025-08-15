'use client'

import { useState } from 'react'
import { FaArrowLeft, FaSearch } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import aromaData from '@/data/aromas.json'

const symptomCategories = [
  {
    category: '心・気分',
    symptoms: ['ストレス', '不安', '緊張', '気分の落ち込み', 'イライラ', '不眠']
  },
  {
    category: '体の不調',
    symptoms: ['頭痛', '肩こり', '冷え性', '疲労', '筋肉痛', 'むくみ']
  },
  {
    category: '女性特有',
    symptoms: ['PMS', '更年期症状', '生理痛', 'ホルモンバランス']
  },
  {
    category: '季節の悩み',
    symptoms: ['花粉症', '風邪予防', '鼻づまり', '乾燥肌']
  },
  {
    category: '美容',
    symptoms: ['肌荒れ', '美肌', 'ニキビ', 'アンチエイジング']
  }
]

export default function SymptomsPage() {
  const router = useRouter()
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')

  const getRecommendedAromas = (symptom: string) => {
    return aromaData.aromas.filter(aroma => 
      aroma.symptoms.some(s => s.includes(symptom)) ||
      aroma.effects.some(e => e.includes(symptom))
    )
  }

  const filteredSymptoms = symptomCategories.map(cat => ({
    ...cat,
    symptoms: cat.symptoms.filter(s => 
      s.toLowerCase().includes(searchText.toLowerCase())
    )
  })).filter(cat => cat.symptoms.length > 0)

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
          症状から探す
        </h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-light)]" />
          <input
            type="text"
            placeholder="症状を検索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-gray)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      <main className="px-4 py-6">
        {selectedSymptom ? (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setSelectedSymptom(null)}
                className="text-[var(--primary)] text-sm mb-2"
              >
                ← 症状一覧に戻る
              </button>
              <h3 className="text-lg font-bold text-[var(--text-dark)]">
                「{selectedSymptom}」におすすめのアロマ
              </h3>
            </div>
            
            <div className="space-y-3">
              {getRecommendedAromas(selectedSymptom).map((aroma) => (
                <div
                  key={aroma.id}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-[var(--text-dark)]">
                        {aroma.name_ja}
                      </h4>
                      <p className="text-sm text-[var(--text-light)] mt-1">
                        {aroma.category}
                      </p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: aroma.color }}
                    />
                  </div>
                  
                  <p className="text-sm text-[var(--text-dark)] mb-3">
                    {aroma.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {aroma.effects.slice(0, 4).map((effect) => (
                      <span
                        key={effect}
                        className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-[var(--text-dark)] mb-1">
                      使い方
                    </p>
                    <p className="text-xs text-[var(--text-light)]">
                      ディフューザー: {aroma.usage.diffuser} / お風呂: {aroma.usage.bath}
                    </p>
                  </div>
                </div>
              ))}
              
              {getRecommendedAromas(selectedSymptom).length === 0 && (
                <div className="bg-white rounded-2xl p-6 text-center">
                  <p className="text-[var(--text-light)]">
                    該当するアロマが見つかりませんでした
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSymptoms.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-bold text-[var(--text-dark)] mb-2">
                  {category.category}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.symptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => setSelectedSymptom(symptom)}
                      className="bg-white rounded-xl py-3 px-4 text-sm text-[var(--text-dark)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors text-left"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}