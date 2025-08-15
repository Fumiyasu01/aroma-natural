export type User = {
  id: string
  email: string
  name: string
  avatar_url?: string
  current_streak: number
  longest_streak: number
  created_at: string
}

export type UserProfile = {
  user_id: string
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  concerns: string[]
  owned_aromas: string[]
  notification_time?: string
}

export type RecordStatus = 'planned' | 'completed' | 'skipped'

export type Record = {
  id: string
  user_id: string
  date: string
  status: RecordStatus
  selected_aromas: string[]
  used_aromas?: string[]
  drops?: number[]
  mood_before?: number
  mood_after?: number
  usage_method?: string
  photo_url?: string
  notes?: string
  created_at: string
}

export type Team = {
  id: string
  name: string
  description?: string
  created_by: string
  invite_code: string
  is_public: boolean
  created_at: string
}

export type TeamMember = {
  team_id: string
  user_id: string
  joined_at: string
  role: 'admin' | 'member'
}

export type AIConsultation = {
  id: string
  user_id: string
  user_message: string
  ai_response: string
  suggested_aromas: string[]
  created_at: string
}

export type Aroma = {
  id: string
  name_ja: string
  name_en: string
  category: string
  effects: string[]
  symptoms: string[]
  scenes: string[]
  price_range: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  blend_well: string[]
  cautions: string[]
  usage: {
    diffuser: string
    bath: string
    massage: string
  }
  description: string
  color: string
}

export type BlendRecipe = {
  id: string
  name: string
  recipe: {
    aroma_id: string
    drops: number
  }[]
  effects: string[]
  scene: string
}