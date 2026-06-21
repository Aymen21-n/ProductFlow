import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { setAuthToken } from '../../../api/axios'
import { useAuth } from '../../../features/auth/AuthContext'
import { getFacturesByUser } from '../../../services/factureService'
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

export default function FacturesUser() {
  const { state } = useAuth()
  const [factures, setFactures] = useState<Facture[]>([])
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthToken(state.token)
  }, [state.token])

  useEffect(() => {
    async function fetchFactures() {
      if (!state.user) {
        setFactures([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await getFacturesByUser(state.user.id)
        const sortedFactures = [...data].sort(
          (firstFacture, secondFacture) =>
            new Date(secondFacture.date).getTime() -
            new Date(firstFacture.date).getTime(),
        )

        setFactures(sortedFactures)
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
  }, [state.user])

  function closeModal() {
    setSelectedFacture(null)
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Mon compte</p>
          <h1>Mes factures</h1>
        </div>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <section className={styles.tablePanel}>
        {isLoading ? (
          <div className={styles.loading}>Chargement des factures...</div>
        ) : factures.length === 0 ? (
          <div className={styles.empty}>
            <p>Aucune facture pour le moment.</p>
            <Link className={styles.primaryButton} to="/user/commandes">
              Voir mes commandes
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Numéro de facture</th>
                  <th>Date</th>
                  <th>Montant total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {factures.map((facture) => (
                  <tr key={facture.id}>
                    <td>{formatFactureNumber(facture.id)}</td>
                    <td>{formatDate(facture.date)}</td>
                    <td>{formatPrice(facture.montantTotal)}</td>
                    <td>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => setSelectedFacture(facture)}
                      >
                        Voir la facture
                      </button>
                    </td>
                  </tr>
                ))}
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
