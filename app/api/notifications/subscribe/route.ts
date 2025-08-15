import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()
    
    // 実際のアプリケーションでは、ここでデータベースに購読情報を保存
    console.log('Push subscription received:', subscription)
    
    // デモ用：成功レスポンスを返す
    return NextResponse.json({ 
      success: true,
      message: '通知の購読に成功しました' 
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: '購読の登録に失敗しました' },
      { status: 500 }
    )
  }
}