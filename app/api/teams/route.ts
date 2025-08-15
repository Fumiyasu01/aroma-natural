import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    // 公開チーム一覧（認証不要）
    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members(count)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Teams fetch error:', error)
      return NextResponse.json({ error: 'チーム一覧の取得に失敗しました' }, { status: 500 })
    }

    // ユーザーが参加しているチームを取得（認証時のみ）
    let userTeams: any[] = []
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (user) {
        const { data: memberTeams } = await supabase
          .from('team_members')
          .select(`
            teams(*)
          `)
          .eq('user_id', user.id)
        
        userTeams = memberTeams?.map((m: any) => m.teams).filter(Boolean) || []
      }
    }

    return NextResponse.json({ 
      teams: teams || [],
      userTeams 
    })
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
    
    // チーム作成
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: body.name,
        description: body.description,
        is_public: body.is_public !== false,
        settings: body.settings || {},
        created_by: user.id
      })
      .select()
      .single()

    if (teamError) {
      console.error('Team creation error:', teamError)
      return NextResponse.json({ error: 'チームの作成に失敗しました' }, { status: 500 })
    }

    // 作成者をメンバーとして追加
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'admin',
        joined_at: new Date().toISOString()
      })

    if (memberError) {
      console.error('Member addition error:', memberError)
    }

    return NextResponse.json({ team })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}