'use client'

import { FaTimes, FaTint, FaBookmark } from 'react-icons/fa'
import { Aroma, BlendRecipe } from '@/types'
import aromaData from '@/data/aromas.json'

interface AromaRecommendationProps {
  recommendations: {
    aromas: Aroma[]
    blend: BlendRecipe
  }
  onClose: () => void
}

export default function AromaRecommendation({ recommendations, onClose }: AromaRecommendationProps) {
  const { aromas, blend } = recommendations

  const handleSelectAroma = (aromaId: string) => {
    console.log('Selected aroma:', aromaId)
    onClose()
  }

  const getAromaById = (id: string) => {
    return aromaData.aromas.find(a => a.id === id)
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="safe-top sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-[var(--text-dark)]">
            おすすめのアロマ
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-4 pb-20">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[var(--text-dark)] mb-3">
            単体でおすすめ
          </h3>
          <div className="space-y-3">
            {aromas.map((aroma) => (
              <div
                key={aroma.id}
                className="bg-white border border-gray-200 rounded-2xl p-4"
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

                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-sm font-medium text-[var(--text-dark)] mb-2">
                    使い方
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <FaTint className="text-[var(--primary)] mr-2 text-xs" />
                      <span className="text-[var(--text-light)]">
                        ディフューザー: {aroma.usage.diffuser}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FaTint className="text-[var(--primary)] mr-2 text-xs" />
                      <span className="text-[var(--text-light)]">
                        お風呂: {aroma.usage.bath}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectAroma(aroma.id)}
                  className="w-full bg-[var(--primary)] text-white rounded-full py-3 font-medium"
                >
                  今日はこれにする
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-[var(--text-dark)] mb-3">
            ブレンドレシピ
          </h3>
          <div className="bg-gradient-to-br from-[var(--primary-light)] to-white border border-[var(--primary)] border-opacity-20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-[var(--text-dark)]">
                {blend.name}
              </h4>
              <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-50">
                <FaBookmark className="text-[var(--primary)]" />
              </button>
            </div>

            <div className="bg-white bg-opacity-60 rounded-xl p-3 mb-3">
              <p className="text-sm font-medium text-[var(--text-dark)] mb-2">
                レシピ
              </p>
              <div className="space-y-2">
                {blend.recipe.map((item) => {
                  const aroma = getAromaById(item.aroma_id)
                  return (
                    <div key={item.aroma_id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: aroma?.color }}
                        />
                        <span className="text-sm text-[var(--text-dark)]">
                          {aroma?.name_ja}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[var(--primary)]">
                        {item.drops}滴
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center mb-3">
              <span className="text-sm text-[var(--text-light)]">
                おすすめシーン: {blend.scene}
              </span>
            </div>

            <button
              onClick={() => handleSelectAroma(blend.id)}
              className="w-full bg-[var(--primary)] text-white rounded-full py-3 font-medium"
            >
              このブレンドを使う
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-[var(--primary)] font-medium"
          >
            他の提案を見る
          </button>
        </div>
      </div>
    </div>
  )
}