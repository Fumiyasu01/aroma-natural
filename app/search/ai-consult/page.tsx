'use client'

import { useState, useEffect } from 'react'
import { FaPaperPlane, FaRobot, FaUser, FaArrowLeft, FaHistory } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import aromaData from '@/data/aromas.json'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  suggestedAromas?: string[]
}

export default function AIConsultPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'こんにちは！アロマの相談をお受けします。症状や気分、使いたいシーンなど、お気軽にお聞かせください。',
    }
  ])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [consultationHistory, setConsultationHistory] = useState<any[]>([])

  // 履歴を取得
  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.access_token) return

      try {
        const response = await fetch('/api/ai-consultations', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setConsultationHistory(data.consultations || [])
        }
      } catch (error) {
        console.error('Failed to fetch consultation history:', error)
      }
    }

    fetchHistory()
  }, [session])

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputText,
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setLoading(true)

    try {
      const headers: any = {
        'Content-Type': 'application/json',
      }
      
      // ログインしている場合は認証ヘッダーを追加
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/ai-consult', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message: inputText,
          saveHistory: !!session?.access_token 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const aiMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
          suggestedAromas: data.suggestedAromas,
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: '申し訳ございません。現在AI相談機能が利用できません。しばらくしてからお試しください。',
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '申し訳ございません。エラーが発生しました。',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const getAromaById = (id: string) => {
    return aromaData.aromas.find(a => a.id === id)
  }

  const quickQuestions = [
    '眠れない時のアロマは？',
    'ストレス解消におすすめは？',
    '集中力を高めたい',
    '花粉症に効くアロマ',
  ]

  const loadHistoryMessage = (consultation: any) => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'こんにちは！アロマの相談をお受けします。症状や気分、使いたいシーンなど、お気軽にお聞かせください。',
      },
      {
        id: 2,
        role: 'user',
        content: consultation.message,
      },
      {
        id: 3,
        role: 'assistant',
        content: consultation.response,
        suggestedAromas: consultation.suggested_aromas,
      }
    ])
    setShowHistory(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-gray)] flex flex-col">
      <header className="safe-top bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-3 p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowLeft className="text-[var(--text-dark)]" />
            </button>
            <h1 className="text-xl font-bold text-[var(--text-dark)]">
              AI相談
            </h1>
          </div>
          {session && consultationHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FaHistory className="text-[var(--text-dark)]" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: '180px' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] ${
                message.role === 'user'
                  ? 'order-2'
                  : 'order-1'
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-[var(--primary)] order-2'
                      : 'bg-gray-200 order-1'
                  }`}
                >
                  {message.role === 'user' ? (
                    <FaUser className="text-white text-sm" />
                  ) : (
                    <FaRobot className="text-[var(--text-dark)] text-sm" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-[var(--primary)] text-white order-1'
                      : 'bg-white order-2'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.suggestedAromas && message.suggestedAromas.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm font-bold mb-2 text-[var(--text-dark)]">
                        おすすめアロマ
                      </p>
                      <div className="space-y-2">
                        {message.suggestedAromas.map(aromaId => {
                          const aroma = getAromaById(aromaId)
                          if (!aroma) return null
                          return (
                            <div
                              key={aromaId}
                              className="flex items-center gap-2 bg-[var(--bg-gray)] rounded-lg px-2 py-1"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: aroma.color }}
                              />
                              <span className="text-sm text-[var(--text-dark)]">
                                {aroma.name_ja}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="mb-4 flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-36 max-w-[430px] mx-auto bg-gradient-to-t from-white via-white to-transparent pt-4">
          <p className="text-sm text-[var(--text-light)] mb-2">よくある相談</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() => setInputText(question)}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-[var(--text-dark)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-4 pb-20 max-w-[430px] mx-auto">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="アロマについて相談してください..."
            className="flex-1 px-4 py-3 bg-[var(--bg-gray)] rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || loading}
            className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-opacity-90 transition-colors"
          >
            <FaPaperPlane className="text-base" />
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-dark)]">
                相談履歴
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaArrowLeft className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {consultationHistory.length === 0 ? (
                <p className="text-center text-[var(--text-light)]">
                  まだ相談履歴がありません
                </p>
              ) : (
                <div className="space-y-3">
                  {consultationHistory.map((consultation) => (
                    <button
                      key={consultation.id}
                      onClick={() => loadHistoryMessage(consultation)}
                      className="w-full bg-gray-50 rounded-xl p-3 text-left hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-sm font-medium text-[var(--text-dark)] mb-1 line-clamp-2">
                        {consultation.message}
                      </p>
                      <p className="text-xs text-[var(--text-light)]">
                        {new Date(consultation.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}