export type MatchStatus = 'scheduled' | 'ongoing' | 'finished' | 'postponed' | 'cancelled'

export interface Match {
  id: number
  team_a: string
  team_b: string
  match_date: string
  score_a: number | null
  score_b: number | null
  status: MatchStatus
  result_final: string | null
}

export interface Prediction {
  id: number
  user_id: number | null
  anonymous_id: string | null
  match_id: number
  pred_a: number
  pred_b: number
  points_earned: number
  prediction_date: string
}

export interface RankingEntry {
  position: number
  user_id: number
  username: string
  total_points: number
  total_predictions: number
}

export interface RankingResponse {
  data: RankingEntry[]
  total: number
  limit: number
  offset: number
}

export interface User {
  id: number
  username: string
  email: string
  created_at: string
}

export interface Token {
  access_token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}
