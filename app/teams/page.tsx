'use client'

import { useState, useEffect } from 'react'
import { FaUsers, FaPlus, FaSearch, FaCrown, FaLock, FaGlobe } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import CreateTeamModal from '@/components/CreateTeamModal'

interface Team {
  id: string
  name: string
  description: string
  is_public: boolean
  created_at: string
  team_members: any[]
}

export default function TeamsPage() {
  const router = useRouter()
  const { session, user } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const [searchText, setSearchText] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'my' | 'explore'>('my')

  useEffect(() => {
    fetchTeams()
  }, [session])

  const fetchTeams = async () => {
    try {
      const headers: any = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/teams', { headers })
      
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams || [])
        setUserTeams(data.userTeams || [])
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (teamData: any) => {
    if (!session?.access_token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(teamData)
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/teams/${data.team.id}`)
      }
    } catch (error) {
      console.error('Failed to create team:', error)
    }
  }

  const filteredTeams = activeTab === 'my' 
    ? userTeams.filter(team => 
        team.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : teams.filter(team => 
        team.name.toLowerCase().includes(searchText.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchText.toLowerCase())
      )

  return (
    <div className="min-h-screen bg-[var(--bg-gray)]">
      <Header />

      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-[var(--text-dark)] mb-3">
            チーム
          </h1>
          
          <div className="relative mb-3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="text"
              placeholder="チームを検索..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-gray)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex border-t border-gray-100">
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'my'
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                  : 'text-[var(--text-light)]'
              }`}
            >
              参加中
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'explore'
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                  : 'text-[var(--text-light)]'
              }`}
            >
              探す
            </button>
          </div>
        </div>
      </div>

      <main className="px-4 py-6">
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              チームに参加するにはログインが必要です
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-2 text-[var(--primary)] font-medium text-sm"
            >
              ログインする
            </button>
          </div>
        )}

        {activeTab === 'my' && userTeams.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-[var(--text-light)] mb-4">
              まだチームに参加していません
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-[var(--primary)] font-medium"
            >
              チームを探す
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => router.push(`/teams/${team.id}`)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[var(--primary-light)] rounded-full flex items-center justify-center mr-3">
                      <FaUsers className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text-dark)] flex items-center">
                        {team.name}
                        {team.is_public ? (
                          <FaGlobe className="ml-2 text-xs text-[var(--text-light)]" />
                        ) : (
                          <FaLock className="ml-2 text-xs text-[var(--text-light)]" />
                        )}
                      </h3>
                      <p className="text-sm text-[var(--text-light)]">
                        {team.team_members?.length || 0} メンバー
                      </p>
                    </div>
                  </div>
                </div>
                {team.description && (
                  <p className="text-sm text-[var(--text-dark)] line-clamp-2">
                    {team.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => {
          if (!user) {
            router.push('/login')
          } else {
            setShowCreateModal(true)
          }
        }}
        className="fixed bottom-20 right-4 bg-[var(--primary)] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      >
        <FaPlus className="text-xl" />
      </button>

      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTeam}
        />
      )}
    </div>
  )
}