import api from '../api/axios'
import type { Produit } from '../types'

export async function getProduits(): Promise<Produit[]> {
  try {
    const response = await api.get<Produit[]>('/produits')

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Impossible de recuperer les produits.',
    )
  }
}

export async function getProduitById(id: string): Promise<Produit> {
  try {
    const response = await api.get<Produit>(`/produits/${id}`)

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Impossible de recuperer le produit ${id}.`,
    )
  }
}
