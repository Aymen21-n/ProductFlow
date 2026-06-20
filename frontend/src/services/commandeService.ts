import api from '../api/axios'
import type { Commande } from '../types/index'

export async function getCommandes(): Promise<Commande[]> {
  try {
    const response = await api.get<Commande[]>('/commandes')

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Impossible de recuperer les commandes.',
    )
  }
}

export async function getCommandesByUser(
  userId: string,
): Promise<Commande[]> {
  try {
    const response = await api.get<Commande[]>(`/commandes/user/${userId}`)

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Impossible de recuperer les commandes utilisateur.',
    )
  }
}

export async function createCommande(
  data: Omit<Commande, 'id'>,
): Promise<Commande> {
  try {
    const response = await api.post<Commande>('/commandes', data)

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Impossible de creer la commande.',
    )
  }
}

export async function updateStatutCommande(
  id: string,
  statut: 'approuvee' | 'refusee',
): Promise<Commande> {
  try {
    const response = await api.put<Commande>(`/commandes/${id}/statut`, {
      statut,
    })

    return response.data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Impossible de modifier le statut de la commande.',
    )
  }
}
