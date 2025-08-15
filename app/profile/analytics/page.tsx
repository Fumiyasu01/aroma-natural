'use client'

import { useState, useEffect } from 'react'
import { FaArrowLeft, FaChartLine, FaCalendarAlt, FaAward, FaTint } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import aromaData from '@/data/aromas.json'

interface Record {
  id: string
  date: string
  aroma_ids: string[]
  mood_before: number
  mood_after: number
  notes?: string
  created_at: string
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    fetchRecords()
  }, [session])

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

  // 気分改善トレンドデータの生成
  const getMoodTrendData = () => {
    const today = new Date()
    const startDate = selectedPeriod === 'week' 
      ? new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      : selectedPeriod === 'month'
      ? startOfMonth(today)
      : new Date(today.getFullYear(), 0, 1)

    const endDate = today
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const dayRecords = records.filter(r => r.date === dateStr)
      
      const avgImprovement = dayRecords.length > 0
        ? dayRecords.reduce((sum, r) => sum + (r.mood_after - r.mood_before), 0) / dayRecords.length
        : 0

      return {
        date: format(day, 'M/d'),
        improvement: avgImprovement,
        count: dayRecords.length
      }
    }).slice(-30) // 最大30日分
  }

  // アロマ使用頻度データの生成
  const getAromaUsageData = () => {
    const aromaCount: { [key: string]: number } = {}
    
    records.forEach(record => {
      if (record.aroma_ids) {
        record.aroma_ids.forEach(aromaId => {
          aromaCount[aromaId] = (aromaCount[aromaId] || 0) + 1
        })
      }
    })

    return Object.entries(aromaCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([aromaId, count]) => {
        const aroma = aromaData.aromas.find(a => a.id === aromaId)
        return {
          name: aroma?.name_ja || aromaId,
          count,
          color: aroma?.color || '#9B7EBD'
        }
      })
  }

  // 時間帯別使用データの生成
  const getTimeDistributionData = () => {
    const timeSlots = {
      '朝': 0,
      '昼': 0,
      '夕方': 0,
      '夜': 0
    }

    records.forEach(record => {
      const hour = new Date(record.created_at).getHours()
      if (hour < 10) timeSlots['朝']++
      else if (hour < 15) timeSlots['昼']++
      else if (hour < 19) timeSlots['夕方']++
      else timeSlots['夜']++
    })

    return Object.entries(timeSlots).map(([time, count]) => ({
      time,
      count
    }))
  }

  // 月間サマリーの計算
  const getMonthlyStats = () => {
    const currentMonth = new Date()
    const monthRecords = records.filter(r => {
      const recordDate = new Date(r.date)
      return recordDate.getMonth() === currentMonth.getMonth() &&
             recordDate.getFullYear() === currentMonth.getFullYear()
    })

    const totalImprovement = monthRecords.reduce((sum, r) => 
      sum + (r.mood_after - r.mood_before), 0
    )

    const avgImprovement = monthRecords.length > 0 
      ? totalImprovement / monthRecords.length 
      : 0

    return {
      totalRecords: monthRecords.length,
      avgImprovement: avgImprovement.toFixed(1),
      totalAromas: new Set(monthRecords.flatMap(r => r.aroma_ids || [])).size
    }
  }

  const moodTrendData = getMoodTrendData()
  const aromaUsageData = getAromaUsageData()
  const timeDistributionData = getTimeDistributionData()
  const monthlyStats = getMonthlyStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-gray)] flex items-center justify-center">
        <div className="text-[var(--text-light)]">分析中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <Header />

      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[var(--primary)] mb-3"
          >
            <FaArrowLeft className="mr-2" />
            戻る
          </button>
          <h1 className="text-xl font-bold text-[var(--text-dark)]">
            使用分析
          </h1>
        </div>
      </div>

      <main className="px-4 py-6">
        {/* 月間サマリー */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-[var(--primary)] mr-2" />
            <h3 className="font-bold text-[var(--text-dark)]">
              今月のサマリー
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[var(--bg-gray)] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">
                {monthlyStats.totalRecords}
              </p>
              <p className="text-xs text-[var(--text-light)]">記録回数</p>
            </div>
            <div className="bg-[var(--bg-gray)] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[var(--success)]">
                +{monthlyStats.avgImprovement}
              </p>
              <p className="text-xs text-[var(--text-light)]">平均改善度</p>
            </div>
            <div className="bg-[var(--bg-gray)] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[var(--action)]">
                {monthlyStats.totalAromas}
              </p>
              <p className="text-xs text-[var(--text-light)]">使用種類</p>
            </div>
          </div>
        </div>

        {/* 気分改善トレンド */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaChartLine className="text-[var(--primary)] mr-2" />
              <h3 className="font-bold text-[var(--text-dark)]">
                気分改善トレンド
              </h3>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="text-sm text-[var(--primary)] bg-transparent"
            >
              <option value="week">1週間</option>
              <option value="month">1ヶ月</option>
              <option value="year">1年</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                domain={[-5, 5]}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="improvement" 
                stroke="var(--primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--primary)', r: 3 }}
                name="改善度"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* よく使うアロマ */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <FaTint className="text-[var(--primary)] mr-2" />
            <h3 className="font-bold text-[var(--text-dark)]">
              よく使うアロマ TOP5
            </h3>
          </div>

          {aromaUsageData.length === 0 ? (
            <p className="text-sm text-[var(--text-light)] text-center py-4">
              まだデータがありません
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={aromaUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" name="使用回数">
                  {aromaUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 時間帯別使用 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <FaAward className="text-[var(--primary)] mr-2" />
            <h3 className="font-bold text-[var(--text-dark)]">
              時間帯別使用
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={timeDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.time}: ${entry.count}回`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
              >
                {timeDistributionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={['#9B7EBD', '#FFB6C1', '#FFA726', '#87CEEB'][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  )
}