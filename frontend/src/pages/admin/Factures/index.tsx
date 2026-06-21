import { isAxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { setAuthToken } from '../../../api/axios'
import { useAuth } from '../../../features/auth/AuthContext'
import { getFactures } from '../../../services/factureService'
import type { Facture, LignePanier } from '../../../types/index'
import styles from './Factures.module.css'

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

function formatFactureNumber(id: string) {
  return id.length > 10 ? `${id.slice(0, 10)}...` : id
}

function getLineSubtotal(ligne: LignePanier) {
  return ligne.prix * ligne.quantite
}

function getUserNom(userId: string | { _id: string; nom: string }): string {
  return typeof userId === 'object' ? userId.nom : userId
}

export default function FacturesAdmin() {
  const { state } = useAuth()
  const [factures, setFactures] = useState<Facture[]>([])
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null)
  const [filterUser, setFilterUser] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthToken(state.token)
  }, [state.token])

  useEffect(() => {
    async function fetchFactures() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getFactures()
        setFactures(
          [...data].sort(
            (firstFacture, secondFacture) =>
              new Date(secondFacture.date).getTime() -
              new Date(firstFacture.date).getTime(),
          ),
        )
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError,
            'Impossible de charger les factures.',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchFactures()
  }, [])

  const filteredFactures = useMemo(() => {
    const normalizedFilter = filterUser.trim().toLowerCase()

    if (normalizedFilter.length === 0) {
      return factures
    }

    return factures.filter((facture) =>
      getUserNom(facture.userId).toLowerCase().includes(normalizedFilter),
    )
  }, [factures, filterUser])

  function closeModal() {
    setSelectedFacture(null)
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Administration</p>
          <h1>Gestion des factures</h1>
        </div>
      </header>

      <div className={styles.filterBar}>
        <input
          type="text"
          value={filterUser}
          onChange={(event) => setFilterUser(event.target.value)}
          placeholder="Filtrer par userId..."
          aria-label="Filtrer par userId"
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <section className={styles.tablePanel}>
        {isLoading ? (
          <div className={styles.loading}>Chargement des factures...</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID facture</th>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Montant total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactures.length === 0 ? (
                  <tr>
                    <td className={styles.empty} colSpan={5}>
                      Aucune facture disponible.
                    </td>
                  </tr>
                ) : (
                  filteredFactures.map((facture) => (
                    <tr key={facture.id}>
                      <td title={facture.id}>{formatFactureNumber(facture.id)}</td>
                      <td>{formatDate(facture.date)}</td>
                      <td>{getUserNom(facture.userId)}</td>
                      <td>{formatPrice(facture.montantTotal)}</td>
                      <td>
                        <button
                          className={styles.secondaryButton}
                          type="button"
                          onClick={() => setSelectedFacture(facture)}
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedFacture && (
        <div className={styles.modalOverlay} role="presentation">
          <section
            className={styles.modal}
            aria-labelledby="facture-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.kicker}>
                  Facture {selectedFacture.id}
                </p>
                <h2 id="facture-modal-title">Détail de la facture</h2>
              </div>
              <button
                className={styles.closeButton}
                type="button"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>

            <div className={styles.factureMeta}>
              <span>ID facture</span>
              <strong>{selectedFacture.id}</strong>
              <span>Date</span>
              <strong>{formatDate(selectedFacture.date)}</strong>
              <span>UserId</span>
              <strong>{getUserNom(selectedFacture.userId)}</strong>
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
                  {selectedFacture.lignes.map((ligne) => (
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
              <strong>{formatPrice(selectedFacture.montantTotal)}</strong>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}
