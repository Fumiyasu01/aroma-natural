'use client'

import { Component, ReactNode } from 'react'
import { FaExclamationTriangle, FaHome, FaSync } from 'react-icons/fa'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-gray)] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
              エラーが発生しました
            </h1>
            
            <p className="text-[var(--text-light)] mb-6">
              申し訳ございません。予期しないエラーが発生しました。
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-[var(--text-light)] cursor-pointer">
                  詳細情報
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-[var(--primary)] text-white rounded-full px-8 py-3 font-medium flex items-center justify-center"
              >
                <FaSync className="mr-2" />
                再読み込み
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full text-[var(--primary)] font-medium flex items-center justify-center"
              >
                <FaHome className="mr-2" />
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}