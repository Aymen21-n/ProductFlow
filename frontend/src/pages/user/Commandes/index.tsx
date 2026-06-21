import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { setAuthToken } from '../../../api/axios'
import { useAuth } from '../../../features/auth/AuthContext'
import { getCommandesByUser } from '../../../services/commandeService'
import type { Commande, LignePanier } from '../../../types/index'
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

function getLineSubtotal(ligne: LignePanier) {
  return ligne.prix * ligne.quantite
}

export default function CommandesUser() {
  const { state } = useAuth()
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthToken(state.token)
  }, [state.token])

  useEffect(() => {
    async function fetchCommandes() {
      if (!state.user) {
        setCommandes([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await getCommandesByUser(state.user.id)
        const sortedCommandes = [...data].sort(
          (firstCommande, secondCommande) =>
            new Date(secondCommande.date).getTime() -
            new Date(firstCommande.date).getTime(),
        )

        setCommandes(sortedCommandes)
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
  }, [state.user])

  function closeModal() {
    setSelectedCommande(null)
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Mon compte</p>
          <h1>Mes commandes</h1>
        </div>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <section className={styles.tablePanel}>
        {isLoading ? (
          <div className={styles.loading}>Chargement des commandes...</div>
        ) : commandes.length === 0 ? (
          <div className={styles.empty}>
            <p>Aucune commande pour le moment.</p>
            <Link className={styles.primaryButton} to="/user/panier">
              Voir mon panier
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Montant total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commandes.map((commande) => (
                  <tr key={commande.id}>
                    <td>{formatDate(commande.date)}</td>
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
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => setSelectedCommande(commande)}
                      >
                        Voir le détail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedCommande && (
        <div className={styles.modalOverlay} role="presentation">
          <section
            className={styles.modal}
            aria-labelledby="commande-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.kicker}>
                  {formatDate(selectedCommande.date)}
                </p>
                <h2 id="commande-modal-title">Détail de la commande</h2>
              </div>
              <button
                className={styles.closeButton}
                type="button"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCommande.lignes.map((ligne) => (
                    <tr key={ligne.produitId}>
                      <td>
                        <img
                          className={styles.productImage}
                          src={ligne.image}
                          alt={ligne.nom}
                        />
                      </td>
                      <td>
                        <strong>{ligne.nom}</strong>
                      </td>
                      <td>{ligne.quantite}</td>
                      <td>{formatPrice(ligne.prix)}</td>
                      <td>{formatPrice(getLineSubtotal(ligne))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className={styles.modalFooter}>
              <span>Montant total</span>
              <strong>{formatPrice(selectedCommande.montantTotal)}</strong>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}
