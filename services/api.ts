import axios, { AxiosError } from 'axios'
import * as Types from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir token
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export const api = {
  // Auth
  async register(payload: Types.RegisterPayload) {
    return client.post<Types.User>('/auth/register', payload)
  },
  
  async login(payload: Types.LoginPayload) {
    const res = await client.post<Types.Token>('/auth/login', payload)
    if (res.data.access_token) {
      localStorage.setItem('token', res.data.access_token)
      window.dispatchEvent(new Event('authchange'))
    }
    return res
  },

  async getMe() {
    return client.get<Types.User>('/auth/me')
  },

  // Matches
  async getMatches(status?: string) {
    return client.get<Types.Match[]>('/matches', {
      params: { status },
    })
  },

  async searchMatches(params: {
    q?: string
    team_a?: string
    team_b?: string
    status?: string
  }) {
    return client.get<Types.Match[]>('/matches/search/', {
      params,
    })
  },

  async getMatch(id: number) {
    return client.get<Types.Match>(`/matches/${id}`)
  },

  // Rankings
  async getRankings(limit = 50, offset = 0) {
    return client.get<Types.RankingResponse>('/rankings', {
      params: { limit, offset },
    })
  },

  async getUserRanking(userId: number) {
    return client.get<Types.RankingEntry>(`/rankings/users/${userId}`)
  },

  // Predictions
  async getMyPredictions() {
    return client.get<Types.Prediction[]>('/predictions/mine')
  },

  async createPrediction(matchId: number, predA: number, predB: number) {
    return client.post<Types.Prediction>('/predictions', {
      match_id: matchId,
      pred_a: predA,
      pred_b: predB,
    })
  },
}

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ detail: unknown }>
    const detail = err.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (detail !== undefined) return JSON.stringify(detail)
    return error.message || 'Error desconocido'
  }
  return 'Error desconocido'
}
