import api from '../api/axios'
import type { Produit } from '../types'

export type CreateProduitData = Omit<Produit, 'id'>
export type UpdateProduitData = Partial<CreateProduitData>

export async function getAllProduits(): Promise<Produit[]> {
  const response = await api.get<Produit[]>('/produits')

  return response.data
}

export async function getProduitById(id: string): Promise<Produit> {
  const response = await api.get<Produit>(`/produits/${id}`)

  return response.data
}

export async function createProduit(data: CreateProduitData): Promise<Produit> {
  const response = await api.post<Produit>('/produits', data)

  return response.data
}

export async function updateProduit(
  id: string,
  data: UpdateProduitData,
): Promise<Produit> {
  const response = await api.put<Produit>(`/produits/${id}`, data)

  return response.data
}

export async function deleteProduit(id: string): Promise<void> {
  await api.delete(`/produits/${id}`)
}
