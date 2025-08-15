import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import aromaData from '@/data/aromas.json'
import { supabase } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, saveHistory = false } = body
    
    if (!message) {
      return NextResponse.json({ error: 'メッセージが必要です' }, { status: 400 })
    }

    // 認証チェック（履歴保存時のみ）
    let userId = null
    if (saveHistory) {
      const authHeader = request.headers.get('authorization')
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user } } = await supabase.auth.getUser(token)
        userId = user?.id
      }
    }

    const systemPrompt = `あなたは優しくて親しみやすいアロマテラピーの専門家です。
ユーザーとの自然な会話を大切にしながら、アロマの提案やアドバイスを行います。

以下のアロマ情報を参考にしてください:
${JSON.stringify(aromaData.aromas.map(a => ({
  name: a.name_ja,
  effects: a.effects,
  symptoms: a.symptoms,
  scenes: a.scenes,
  cautions: a.cautions,
  usage: a.usage
})), null, 2)}

対応のポイント:
- 挨拶には優しく挨拶で返す
- 「こんにちは」と言われたら、「こんにちは！今日はどんな気分ですか？」のように自然に返答
- 相談がない時は、無理に提案せず、優しく聞き返す
- 具体的な相談があれば、共感を示してから提案する
- 絵文字は控えめに使用（1-2個程度）
- 堅苦しい説明は避け、友達のように話す

回答は温かく、親しみやすい日本語でお願いします。`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const aiResponse = completion.choices[0].message.content || ''
    
    const suggestedAromas = aromaData.aromas
      .filter(aroma => 
        aiResponse.includes(aroma.name_ja)
      )
      .map(aroma => aroma.id)
      .slice(0, 3)

    // 履歴を保存（ユーザーがログインしている場合）
    if (saveHistory && userId) {
      try {
        await supabase
          .from('ai_consultations')
          .insert({
            user_id: userId,
            message: message,
            response: aiResponse,
            suggested_aromas: suggestedAromas
          })
      } catch (error) {
        console.error('Failed to save consultation history:', error)
      }
    }

    return NextResponse.json({
      response: aiResponse,
      suggestedAromas,
    })
  } catch (error) {
    console.error('AI consultation error:', error)
    return NextResponse.json(
      { error: 'AI相談中にエラーが発生しました' },
      { status: 500 }
    )
  }
}