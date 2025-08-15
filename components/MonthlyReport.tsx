'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaDownload, FaCalendarAlt, FaTrophy, FaChartLine } from 'react-icons/fa'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import aromaData from '@/data/aromas.json'

interface MonthlyReportProps {
  records: any[]
  month: Date
  onClose: () => void
}

export default function MonthlyReport({ records, month, onClose }: MonthlyReportProps) {
  const [achievements, setAchievements] = useState<string[]>([])

  useEffect(() => {
    calculateAchievements()
  }, [records])

  const calculateAchievements = () => {
    const achievementList = []
    
    // 連続記録達成
    const streak = calculateStreak()
    if (streak >= 7) achievementList.push('7日間連続記録達成！')
    if (streak >= 14) achievementList.push('2週間連続記録達成！')
    if (streak >= 30) achievementList.push('1ヶ月連続記録達成！')
    
    // 記録回数
    if (records.length >= 10) achievementList.push('10回以上記録')
    if (records.length >= 20) achievementList.push('20回以上記録')
    
    // アロマバリエーション
    const uniqueAromas = new Set(records.flatMap(r => r.aroma_ids || []))
    if (uniqueAromas.size >= 5) achievementList.push('5種類以上のアロマを使用')
    
    setAchievements(achievementList)
  }

  const calculateStreak = () => {
    if (records.length === 0) return 0
    
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    let streak = 1
    for (let i = 1; i < sortedRecords.length; i++) {
      const prevDate = new Date(sortedRecords[i - 1].date)
      const currDate = new Date(sortedRecords[i].date)
      const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const getMonthlyStats = () => {
    const totalImprovement = records.reduce((sum, r) => 
      sum + (r.mood_after - r.mood_before), 0
    )
    
    const avgImprovement = records.length > 0 
      ? (totalImprovement / records.length).toFixed(1)
      : '0'
    
    const aromaCount: { [key: string]: number } = {}
    records.forEach(record => {
      if (record.aroma_ids) {
        record.aroma_ids.forEach((aromaId: string) => {
          aromaCount[aromaId] = (aromaCount[aromaId] || 0) + 1
        })
      }
    })
    
    const mostUsedAromaId = Object.entries(aromaCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0]
    
    const mostUsedAroma = aromaData.aromas.find(a => a.id === mostUsedAromaId)
    
    return {
      totalRecords: records.length,
      avgImprovement,
      mostUsedAroma: mostUsedAroma?.name_ja || 'なし',
      totalAromas: Object.keys(aromaCount).length,
      streak: calculateStreak()
    }
  }

  const stats = getMonthlyStats()

  const downloadReport = () => {
    const reportContent = `
# ${format(month, 'yyyy年M月', { locale: ja })}のアロマレポート

## 📊 統計サマリー
- 記録回数: ${stats.totalRecords}回
- 平均気分改善度: +${stats.avgImprovement}
- 使用アロマ種類: ${stats.totalAromas}種類
- 最も使用したアロマ: ${stats.mostUsedAroma}
- 連続記録: ${stats.streak}日

## 🏆 達成項目
${achievements.map(a => `- ${a}`).join('\n')}

## 📝 記録詳細
${records.map(r => {
  const aromaNames = r.aroma_ids?.map((id: string) => {
    const aroma = aromaData.aromas.find(a => a.id === id)
    return aroma?.name_ja || id
  }).join(', ') || 'なし'
  
  return `
### ${format(new Date(r.date), 'M月d日', { locale: ja })}
- 使用アロマ: ${aromaNames}
- 気分改善: ${r.mood_before} → ${r.mood_after} (${r.mood_after - r.mood_before > 0 ? '+' : ''}${r.mood_after - r.mood_before})
${r.notes ? `- メモ: ${r.notes}` : ''}
`
}).join('\n')}
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aroma-report-${format(month, 'yyyy-MM')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-dark)] flex items-center">
            <FaCalendarAlt className="mr-2" />
            {format(month, 'yyyy年M月', { locale: ja })}のレポート
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* 統計サマリー */}
          <div className="bg-[var(--primary-light)] rounded-xl p-4 mb-4">
            <h3 className="font-bold text-[var(--text-dark)] mb-3 flex items-center">
              <FaChartLine className="mr-2" />
              統計サマリー
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {stats.totalRecords}
                </p>
                <p className="text-xs text-[var(--text-dark)]">記録回数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--success)]">
                  +{stats.avgImprovement}
                </p>
                <p className="text-xs text-[var(--text-dark)]">平均改善度</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--action)]">
                  {stats.totalAromas}
                </p>
                <p className="text-xs text-[var(--text-dark)]">使用種類</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--pink)]">
                  {stats.streak}
                </p>
                <p className="text-xs text-[var(--text-dark)]">連続日数</p>
              </div>
            </div>
          </div>

          {/* 最も使用したアロマ */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-[var(--text-light)] mb-1">
              最も使用したアロマ
            </p>
            <p className="text-lg font-bold text-[var(--text-dark)]">
              {stats.mostUsedAroma}
            </p>
          </div>

          {/* 達成項目 */}
          {achievements.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-[var(--text-dark)] mb-3 flex items-center">
                <FaTrophy className="mr-2 text-yellow-500" />
                達成項目
              </h3>
              <ul className="space-y-2">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center text-sm text-[var(--text-dark)]">
                    <span className="text-yellow-500 mr-2">🏆</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* コメント */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-[var(--text-dark)]">
              {stats.totalRecords >= 20 
                ? '素晴らしい継続率です！この調子で続けましょう。'
                : stats.totalRecords >= 10
                ? '良いペースで記録できています。'
                : stats.totalRecords >= 5
                ? 'アロマ習慣が定着してきましたね。'
                : 'まずは毎日の記録を目指しましょう。'
              }
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={downloadReport}
            className="w-full bg-[var(--primary)] text-white rounded-full py-3 font-medium flex items-center justify-center"
          >
            <FaDownload className="mr-2" />
            レポートをダウンロード
          </button>
        </div>
      </div>
    </div>
  )
}