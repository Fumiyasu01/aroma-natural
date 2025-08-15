'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaFire, FaCalendarAlt, FaFileAlt } from 'react-icons/fa'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import RecordModal from '@/components/RecordModal'
import MonthlyReport from '@/components/MonthlyReport'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'

export default function RecordsPage() {
  const { user, session } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [showMonthlyReport, setShowMonthlyReport] = useState(false)
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const weekDays = ['日', '月', '火', '水', '木', '金', '土']
  
  const firstDayOfWeek = monthStart.getDay()
  const emptyDays = Array(firstDayOfWeek).fill(null)

  // 記録データを取得
  useEffect(() => {
    const fetchRecords = async () => {
      if (!session?.access_token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/records', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setRecords(data.records || [])
        }
      } catch (error) {
        console.error('Failed to fetch records:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [session])
  
  const handleSaveRecord = async (record: any) => {
    if (!session?.access_token) {
      alert('ログインが必要です')
      return
    }

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(record)
      })

      if (response.ok) {
        const data = await response.json()
        setRecords(prev => [...prev, data.record])
      } else {
        alert('記録の保存に失敗しました')
      }
    } catch (error) {
      console.error('Failed to save record:', error)
      alert('記録の保存中にエラーが発生しました')
    }
  }
  
  const hasRecord = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return records.some(r => r.date === dateStr)
  }

  // 連続記録日数を計算
  const calculateStreak = () => {
    if (records.length === 0) return 0
    
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < sortedRecords.length; i++) {
      const recordDate = new Date(sortedRecords[i].date)
      recordDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (recordDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  // 最長記録を計算
  const calculateMaxStreak = () => {
    if (records.length === 0) return 0
    
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    let maxStreak = 1
    let currentStreak = 1
    
    for (let i = 1; i < sortedRecords.length; i++) {
      const prevDate = new Date(sortedRecords[i - 1].date)
      const currDate = new Date(sortedRecords[i].date)
      
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }
    
    return maxStreak
  }

  // 今月の記録回数を取得
  const getMonthlyRecordCount = () => {
    const monthRecords = records.filter(r => {
      const recordDate = new Date(r.date)
      return recordDate.getMonth() === currentDate.getMonth() &&
             recordDate.getFullYear() === currentDate.getFullYear()
    })
    return monthRecords.length
  }

  // よく使うアロマを取得
  const getMostUsedAroma = () => {
    if (records.length === 0) return null
    
    const aromaCount: { [key: string]: number } = {}
    
    records.forEach(record => {
      if (record.aroma_ids) {
        record.aroma_ids.forEach((aromaId: string) => {
          aromaCount[aromaId] = (aromaCount[aromaId] || 0) + 1
        })
      }
    })
    
    const mostUsed = Object.entries(aromaCount).sort((a, b) => b[1] - a[1])[0]
    if (mostUsed) {
      // ここで実際のアロマ名を返す処理が必要
      return mostUsed[0]
    }
    
    return null
  }

  // 平均気分改善度を計算
  const getAverageMoodImprovement = () => {
    const recordsWithMood = records.filter(r => 
      r.mood_before && r.mood_after
    )
    
    if (recordsWithMood.length === 0) return null
    
    const totalImprovement = recordsWithMood.reduce((sum, record) => {
      return sum + (record.mood_after - record.mood_before)
    }, 0)
    
    const average = totalImprovement / recordsWithMood.length
    return average > 0 ? `+${average.toFixed(1)}` : average.toFixed(1)
  }
  
  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <Header />

      <main className="px-4 py-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--text-dark)]">
              {format(currentDate, 'yyyy年M月', { locale: ja })}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMonthlyReport(true)}
                className="text-[var(--primary)] text-sm font-medium flex items-center"
              >
                <FaFileAlt className="mr-1" />
                レポート
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="text-[var(--primary)] text-sm font-medium"
              >
                今日
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-[var(--text-light)] font-medium py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const dayHasRecord = hasRecord(day)
              const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center relative
                    ${isToday(day) ? 'bg-[var(--primary-light)]' : ''}
                    ${isSelected ? 'ring-2 ring-[var(--primary)]' : ''}
                    ${dayHasRecord ? '' : 'hover:bg-gray-50'}
                  `}
                >
                  <span className={`
                    text-sm
                    ${isToday(day) ? 'font-bold text-[var(--primary)]' : 'text-[var(--text-dark)]'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayHasRecord && (
                    <div className="w-1.5 h-1.5 bg-[var(--success)] rounded-full absolute bottom-1" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaFire className="text-[var(--action)] mr-2" />
              <h3 className="font-bold text-[var(--text-dark)]">
                連続記録
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-gray)] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">
                {calculateStreak()}
              </p>
              <p className="text-xs text-[var(--text-light)]">現在の連続日数</p>
            </div>
            <div className="bg-[var(--bg-gray)] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[var(--text-dark)]">
                {calculateMaxStreak()}
              </p>
              <p className="text-xs text-[var(--text-light)]">最長記録</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--text-dark)]">
              統計サマリー
            </h3>
            <select className="text-sm text-[var(--primary)] bg-transparent">
              <option>今月</option>
              <option>今週</option>
            </select>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-light)]">使用回数</span>
              <span className="font-bold text-[var(--text-dark)]">
                {getMonthlyRecordCount()}回
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-light)]">よく使うアロマ</span>
              <span className="text-sm text-[var(--text-dark)]">
                {getMostUsedAroma() || 'データなし'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-light)]">平均気分改善度</span>
              <span className="text-sm text-[var(--text-dark)]">
                {getAverageMoodImprovement() || '-'}
              </span>
            </div>
          </div>
        </div>
      </main>

      <button 
        onClick={() => {
          setSelectedDate(new Date())
          setShowRecordModal(true)
        }}
        className="fixed bottom-20 right-4 bg-[var(--primary)] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      >
        <FaPlus className="text-xl" />
      </button>

      {showRecordModal && selectedDate && (
        <RecordModal
          date={selectedDate}
          onClose={() => setShowRecordModal(false)}
          onSave={handleSaveRecord}
        />
      )}

      {showMonthlyReport && (
        <MonthlyReport
          records={records.filter(r => {
            const recordDate = new Date(r.date)
            return recordDate.getMonth() === currentDate.getMonth() &&
                   recordDate.getFullYear() === currentDate.getFullYear()
          })}
          month={currentDate}
          onClose={() => setShowMonthlyReport(false)}
        />
      )}
    </div>
  )
}