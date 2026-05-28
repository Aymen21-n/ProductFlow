import api from '../api/axios'
import type { User } from '../types'

export interface LoginResponse {
  user: User
  token: string
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  })

  return response.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
