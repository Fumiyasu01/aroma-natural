'use client'

import { useState } from 'react'
import { FaArrowLeft, FaTint, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import aromaData from '@/data/aromas.json'

export default function RecipesPage() {
  const router = useRouter()
  const [savedRecipes, setSavedRecipes] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'すべて' },
    { id: 'relax', label: 'リラックス' },
    { id: 'refresh', label: 'リフレッシュ' },
    { id: 'focus', label: '集中' },
    { id: 'sleep', label: '安眠' },
  ]

  const toggleSaveRecipe = (recipeId: string) => {
    setSavedRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  const getAromaById = (id: string) => {
    return aromaData.aromas.find(a => a.id === id)
  }

  const filteredRecipes = selectedCategory === 'all'
    ? aromaData.blends
    : aromaData.blends.filter(blend =>
        blend.effects.some(effect => {
          if (selectedCategory === 'relax') return effect.includes('リラックス') || effect.includes('鎮静')
          if (selectedCategory === 'refresh') return effect.includes('リフレッシュ') || effect.includes('気分転換')
          if (selectedCategory === 'focus') return effect.includes('集中')
          if (selectedCategory === 'sleep') return effect.includes('安眠') || effect.includes('睡眠')
          return false
        })
      )

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
          ブレンドレシピ集
        </h2>
        
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
        <div className="space-y-4">
          {filteredRecipes.map((blend) => (
            <div
              key={blend.id}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-[var(--text-dark)]">
                    {blend.name}
                  </h3>
                  <p className="text-sm text-[var(--text-light)] mt-1">
                    {blend.scene}
                  </p>
                </div>
                <button
                  onClick={() => toggleSaveRecipe(blend.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {savedRecipes.includes(blend.id) ? (
                    <FaBookmark className="text-[var(--primary)]" />
                  ) : (
                    <FaRegBookmark className="text-[var(--text-light)]" />
                  )}
                </button>
              </div>

              <div className="bg-[var(--bg-gray)] rounded-xl p-3 mb-3">
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
                        <div className="flex items-center">
                          <FaTint className="text-[var(--primary)] text-xs mr-1" />
                          <span className="text-sm font-medium text-[var(--primary)]">
                            {item.drops}滴
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {blend.effects.map((effect) => (
                  <span
                    key={effect}
                    className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {savedRecipes.length > 0 && (
          <div className="fixed bottom-20 right-4">
            <button className="bg-[var(--primary)] text-white rounded-full px-4 py-2 shadow-lg flex items-center">
              <FaBookmark className="mr-2" />
              <span className="text-sm">保存済み ({savedRecipes.length})</span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}