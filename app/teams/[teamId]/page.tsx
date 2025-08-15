'use client'

import { useState, useEffect, use } from 'react'
import { FaArrowLeft, FaCrown, FaSignOutAlt, FaPlus, FaTrophy, FaFire } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface TeamMember {
  user_id: string
  role: string
  joined_at: string
  users: {
    id: string
    email: string
  }
}

interface Team {
  id: string
  name: string
  description: string
  is_public: boolean
  created_at: string
  created_by: string
  team_members: TeamMember[]
}

interface Record {
  id: string
  user_id: string
  date: string
  aroma_ids: string[]
  mood_before: number
  mood_after: number
  created_at: string
}

export default function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const router = useRouter()
  const { session, user } = useAuth()
  const [team, setTeam] = useState<Team | null>(null)
  const [recentRecords, setRecentRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const { teamId } = use(params)

  useEffect(() => {
    fetchTeamDetails()
  }, [teamId, session])

  const fetchTeamDetails = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}`)
      
      if (response.ok) {
        const data = await response.json()
        setTeam(data.team)
        setRecentRecords(data.recentRecords || [])
        
        // ユーザーがメンバーかチェック
        if (user) {
          const member = data.team.team_members.find((m: TeamMember) => m.user_id === user.id)
          setIsMember(!!member)
        }
      }
    } catch (error) {
      console.error('Failed to fetch team details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinTeam = async () => {
    if (!session?.access_token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        setIsMember(true)
        fetchTeamDetails() // 再取得
      }
    } catch (error) {
      console.error('Failed to join team:', error)
    }
  }

  const handleLeaveTeam = async () => {
    if (!session?.access_token) return

    if (!confirm('本当にチームから脱退しますか？')) return

    try {
      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        setIsMember(false)
        router.push('/teams')
      }
    } catch (error) {
      console.error('Failed to leave team:', error)
    }
  }

  // チームメンバーごとの記録数を集計
  const getMemberStats = () => {
    const stats: { [key: string]: number } = {}
    
    recentRecords.forEach(record => {
      stats[record.user_id] = (stats[record.user_id] || 0) + 1
    })

    return team?.team_members
      .map(member => ({
        ...member,
        recordCount: stats[member.user_id] || 0
      }))
      .sort((a, b) => b.recordCount - a.recordCount) || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-gray)] flex items-center justify-center">
        <div className="text-[var(--text-light)]">読み込み中...</div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-[var(--bg-gray)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-light)] mb-4">チームが見つかりません</p>
          <button
            onClick={() => router.push('/teams')}
            className="text-[var(--primary)] font-medium"
          >
            チーム一覧に戻る
          </button>
        </div>
      </div>
    )
  }

  const memberStats = getMemberStats()

  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <Header />

      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <button
            onClick={() => router.push('/teams')}
            className="flex items-center text-[var(--primary)] mb-3"
          >
            <FaArrowLeft className="mr-2" />
            戻る
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-[var(--text-dark)]">
                {team.name}
              </h1>
              <p className="text-sm text-[var(--text-light)] mt-1">
                {team.team_members.length} メンバー
              </p>
            </div>
            
            {isMember ? (
              <button
                onClick={handleLeaveTeam}
                className="text-red-500 text-sm font-medium"
              >
                <FaSignOutAlt className="inline mr-1" />
                脱退
              </button>
            ) : (
              <button
                onClick={handleJoinTeam}
                className="bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                <FaPlus className="inline mr-1" />
                参加する
              </button>
            )}
          </div>
          
          {team.description && (
            <p className="text-sm text-[var(--text-dark)] mt-3">
              {team.description}
            </p>
          )}
        </div>
      </div>

      <main className="px-4 py-6">
        {/* メンバーランキング */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <FaTrophy className="text-yellow-500 mr-2" />
            <h3 className="font-bold text-[var(--text-dark)]">
              今月のランキング
            </h3>
          </div>
          
          <div className="space-y-3">
            {memberStats.slice(0, 3).map((member, index) => (
              <div key={member.user_id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-dark)]">
                    {member.users.email.split('@')[0]}
                    {member.role === 'admin' && (
                      <FaCrown className="inline ml-1 text-yellow-500 text-xs" />
                    )}
                  </p>
                  <p className="text-xs text-[var(--text-light)]">
                    {member.recordCount} 回記録
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* チーム活動 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--text-dark)]">
              チーム活動
            </h3>
            <div className="flex items-center text-sm text-[var(--action)]">
              <FaFire className="mr-1" />
              <span>{recentRecords.length} 記録</span>
            </div>
          </div>
          
          {recentRecords.length === 0 ? (
            <p className="text-sm text-[var(--text-light)] text-center py-4">
              まだ記録がありません
            </p>
          ) : (
            <div className="space-y-2">
              {recentRecords.slice(0, 5).map((record) => {
                const member = team.team_members.find(m => m.user_id === record.user_id)
                return (
                  <div key={record.id} className="flex items-center text-sm">
                    <div className="w-8 h-8 bg-[var(--primary-light)] rounded-full flex items-center justify-center mr-3">
                      <span className="text-[var(--primary)] font-bold text-xs">
                        {member?.users.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[var(--text-dark)]">
                        {member?.users.email.split('@')[0]}さんが記録
                      </p>
                      <p className="text-xs text-[var(--text-light)]">
                        {format(new Date(record.created_at), 'M月d日 HH:mm', { locale: ja })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* メンバー一覧 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-[var(--text-dark)] mb-4">
            メンバー
          </h3>
          
          <div className="space-y-3">
            {team.team_members.map((member) => (
              <div key={member.user_id} className="flex items-center">
                <div className="w-10 h-10 bg-[var(--primary-light)] rounded-full flex items-center justify-center mr-3">
                  <span className="text-[var(--primary)] font-bold">
                    {member.users.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-dark)]">
                    {member.users.email.split('@')[0]}
                    {member.role === 'admin' && (
                      <FaCrown className="inline ml-1 text-yellow-500 text-xs" />
                    )}
                  </p>
                  <p className="text-xs text-[var(--text-light)]">
                    {format(new Date(member.joined_at), 'yyyy年M月d日', { locale: ja })}から参加
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}