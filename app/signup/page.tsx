'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaLeaf } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      await signUpWithEmail(email, password, name)
      setSuccess(true)
      setError('')
    } catch (err: any) {
      setError(err.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Google登録に失敗しました')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--primary-light)] to-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
              登録ありがとうございます！
            </h2>
            <p className="text-[var(--text-dark)] mb-6">
              確認メールを送信しました。<br />
              メール内のリンクをクリックして<br />
              登録を完了してください。
            </p>
            <p className="text-sm text-[var(--text-light)] mb-6">
              メールが届かない場合は、<br />
              迷惑メールフォルダをご確認ください。
            </p>
            <Link
              href="/login"
              className="inline-block bg-[var(--primary)] text-white rounded-full px-8 py-3 font-medium hover:bg-opacity-90 transition-colors"
            >
              ログインページへ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--primary-light)] to-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLeaf className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-2">
            新規登録
          </h1>
          <p className="text-[var(--text-light)]">
            アロマライフを始めましょう
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="text"
              placeholder="お名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="password"
              placeholder="パスワード（6文字以上）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="password"
              placeholder="パスワード（確認）"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white rounded-full py-3 font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[var(--text-light)]">または</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-4 w-full bg-white border border-gray-200 text-[var(--text-dark)] rounded-full py-3 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <FaGoogle className="mr-2 text-red-500" />
            Googleで登録
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[var(--text-light)]">
            すでにアカウントをお持ちの方は
          </p>
          <Link
            href="/login"
            className="text-[var(--primary)] font-medium hover:underline"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}