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

    const { data: records, error } = await supabase
      .from('records')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) {
      console.error('Records fetch error:', error)
      return NextResponse.json({ error: '記録の取得に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ records })
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
    const record = {
      ...body,
      user_id: user.id,
    }

    const { data, error } = await supabase
      .from('records')
      .insert(record)
      .select()
      .single()

    if (error) {
      console.error('Record insert error:', error)
      return NextResponse.json({ error: '記録の保存に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ record: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}