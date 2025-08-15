import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 })
    }

    const { data: consultations, error } = await supabase
      .from('ai_consultations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Consultations fetch error:', error)
      return NextResponse.json({ error: '相談履歴の取得に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ consultations })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 })
    }

    const body = await request.json()
    const consultation = {
      user_id: user.id,
      message: body.message,
      response: body.response,
      suggested_aromas: body.suggested_aromas || [],
      context: body.context || {}
    }

    const { data, error } = await supabase
      .from('ai_consultations')
      .insert(consultation)
      .select()
      .single()

    if (error) {
      console.error('Consultation insert error:', error)
      return NextResponse.json({ error: '相談履歴の保存に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ consultation: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}