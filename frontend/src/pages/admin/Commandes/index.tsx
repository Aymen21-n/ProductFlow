import { isAxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { setAuthToken } from '../../../api/axios'
import { useAuth } from '../../../features/auth/AuthContext'
import {
  getCommandes,
  updateStatutCommande,
} from '../../../services/commandeService'
import type { Commande } from '../../../types/index'
import styles from './Commandes.module.css'

interface ApiErrorResponse {
  message?: string
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? fallback
  }

  return error instanceof Error ? error.message : fallback
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function getStatusLabel(statut: Commande['statut']) {
  if (statut === 'approuvee') {
    return 'Approuvée'
  }

  if (statut === 'refusee') {
    return 'Refusée'
  }

  return 'En attente'
}

function getStatusClass(statut: Commande['statut']) {
  if (statut === 'approuvee') {
    return styles.statusApproved
  }

  if (statut === 'refusee') {
    return styles.statusRefused
  }

  return styles.statusPending
}

export default function CommandesAdmin() {
  const { state } = useAuth()
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [filterUser, setFilterUser] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [refusingId, setRefusingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthToken(state.token)
  }, [state.token])

  useEffect(() => {
    async function fetchCommandes() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getCommandes()
        setCommandes(
          [...data].sort(
            (firstCommande, secondCommande) =>
              new Date(secondCommande.date).getTime() -
              new Date(firstCommande.date).getTime(),
          ),
        )
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError,
            'Impossible de charger les commandes.',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCommandes()
  }, [])

  const filteredCommandes = useMemo(() => {
    const normalizedFilter = filterUser.trim().toLowerCase()

    if (normalizedFilter.length === 0) {
      return commandes
    }

    return commandes.filter((commande) =>
      commande.userId.toLowerCase().includes(normalizedFilter),
    )
  }, [commandes, filterUser])

  async function handleUpdateStatut(
    commande: Commande,
    statut: 'approuvee' | 'refusee',
  ) {
    try {
      if (statut === 'approuvee') {
        setApprovingId(commande.id)
      } else {
        setRefusingId(commande.id)
      }

      setError(null)
      const updatedCommande = await updateStatutCommande(commande.id, statut)
      setCommandes((currentCommandes) =>
        currentCommandes.map((currentCommande) =>
          currentCommande.id === commande.id
            ? updatedCommande
            : currentCommande,
        ),
      )
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Impossible de modifier le statut de la commande.',
        ),
      )
    } finally {
      if (statut === 'approuvee') {
        setApprovingId(null)
      } else {
        setRefusingId(null)
      }
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Administration</p>
          <h1>Gestion des commandes</h1>
        </div>
      </header>

      <div className={styles.filterBar}>
        <input
          type="text"
          value={filterUser}
          onChange={(event) => setFilterUser(event.target.value)}
          placeholder="Filtrer par utilisateur..."
          aria-label="Filtrer par utilisateur"
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <section className={styles.tablePanel}>
        {isLoading ? (
          <div className={styles.loading}>Chargement des commandes...</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>UserId</th>
                  <th>Montant total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommandes.length === 0 ? (
                  <tr>
                    <td className={styles.empty} colSpan={5}>
                      Aucune commande disponible.
                    </td>
                  </tr>
                ) : (
                  filteredCommandes.map((commande) => (
                    <tr key={commande.id}>
                      <td>{formatDate(commande.date)}</td>
                      <td>{commande.userId}</td>
                      <td>{formatPrice(commande.montantTotal)}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${getStatusClass(
                            commande.statut,
                          )}`}
                        >
                          {getStatusLabel(commande.statut)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.primaryButton}
                            type="button"
                            disabled={
                              commande.statut !== 'en_attente' ||
                              approvingId === commande.id ||
                              refusingId === commande.id
                            }
                            onClick={() =>
                              void handleUpdateStatut(commande, 'approuvee')
                            }
                          >
                            {approvingId === commande.id
                              ? 'Approbation...'
                              : 'Approuver'}
                          </button>
                          <button
                            className={styles.dangerButton}
                            type="button"
                            disabled={
                              commande.statut !== 'en_attente' ||
                              approvingId === commande.id ||
                              refusingId === commande.id
                            }
                            onClick={() =>
                              void handleUpdateStatut(commande, 'refusee')
                            }
                          >
                            {refusingId === commande.id
                              ? 'Refus...'
                              : 'Refuser'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
