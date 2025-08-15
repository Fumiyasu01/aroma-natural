import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params

    // チーム詳細を取得
    const { data: team, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members(
          *,
          users(id, email)
        )
      `)
      .eq('id', teamId)
      .single()

    if (error || !team) {
      return NextResponse.json({ error: 'チームが見つかりません' }, { status: 404 })
    }

    // メンバーの最近の記録を取得
    const memberIds = team.team_members.map((m: any) => m.user_id)
    const { data: recentRecords } = await supabase
      .from('records')
      .select('*')
      .in('user_id', memberIds)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({ 
      team,
      recentRecords: recentRecords || []
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}