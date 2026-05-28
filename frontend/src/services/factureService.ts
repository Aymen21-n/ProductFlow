import api from '../api/axios'
import type { Facture } from '../types'

export async function getAllFactures(): Promise<Facture[]> {
  const response = await api.get<Facture[]>('/factures')

  return response.data
}

export async function getFacturesByUser(userId: string): Promise<Facture[]> {
  const response = await api.get<Facture[]>(`/factures/user/${userId}`)

  return response.data
}

export async function getFactureById(id: string): Promise<Facture> {
  const response = await api.get<Facture>(`/factures/${id}`)

  return response.data
}
