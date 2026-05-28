import api from '../api/axios'
import type { Commande } from '../types'

export type StatutCommande = Commande['statut']

export async function getAllCommandes(): Promise<Commande[]> {
  const response = await api.get<Commande[]>('/commandes')

  return response.data
}

export async function getCommandesByUser(userId: string): Promise<Commande[]> {
  const response = await api.get<Commande[]>(`/commandes/user/${userId}`)

  return response.data
}

export async function updateStatutCommande(
  id: string,
  statut: StatutCommande,
): Promise<Commande> {
  const response = await api.patch<Commande>(`/commandes/${id}/statut`, {
    statut,
  })

  return response.data
}
