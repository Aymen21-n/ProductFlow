import api from '../api/axios'
import type { Facture } from '../types/index'

export async function getFactures(): Promise<Facture[]> {
  try {
    const response = await api.get<Facture[]>('/factures')

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Impossible de recuperer les factures.',
    )
  }
}

export async function getFacturesByUser(userId: string): Promise<Facture[]> {
  try {
    const response = await api.get<Facture[]>(`/factures/user/${userId}`)

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Impossible de recuperer les factures utilisateur.',
    )
  }
}

export async function getFactureById(id: string): Promise<Facture> {
  try {
    const response = await api.get<Facture>(`/factures/${id}`)

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Impossible de recuperer la facture ${id}.`,
    )
  }
}
