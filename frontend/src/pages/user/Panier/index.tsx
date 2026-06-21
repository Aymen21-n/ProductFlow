import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../../../api/axios'
import { useAuth } from '../../../features/auth/AuthContext'
import { useCartStore } from '../../../store/cartStore'
import type { Commande } from '../../../types/index'
import styles from './Panier.module.css'

interface ApiErrorResponse {
  message?: string
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? fallback
  }

  return fallback
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export default function Panier() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const montantTotal = useCartStore((state) => state.getTotalPrice())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthToken(state.token)
  }, [state.token])

  async function handleSubmitOrder() {
    if (!state.user) {
      setError('Vous devez etre connecte pour passer une commande.')
      return
    }

    if (items.length === 0) {
      setError('Votre panier est vide.')
      return
    }

    const payload: Omit<Commande, 'id'> = {
      userId: state.user.id,
      lignes: items,
      montantTotal,
      statut: 'en_attente',
      date: new Date().toISOString(),
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await api.post<Commande>('/commandes', payload)
      clearCart()
      navigate('/user/commandes')
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Impossible de passer la commande.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Mon compte</p>
          <h1>Mon panier</h1>
        </div>
        <Link className={styles.secondaryButton} to="/user/catalogue">
          Continuer mes achats
        </Link>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <section className={styles.tablePanel}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Votre panier est vide.</p>
            <Link className={styles.primaryButton} to="/user/catalogue">
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Produit</th>
                    <th>Prix unitaire</th>
                    <th>Quantite</th>
                    <th>Sous-total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((ligne) => (
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
                      <td>{formatPrice(ligne.prix)}</td>
                      <td>
                        <div className={styles.quantityControls}>
                          <button
                            className={styles.quantityButton}
                            type="button"
                            disabled={ligne.quantite <= 1}
                            onClick={() =>
                              updateQuantity(
                                ligne.produitId,
                                ligne.quantite - 1,
                              )
                            }
                            aria-label={`Diminuer la quantite de ${ligne.nom}`}
                          >
                            -
                          </button>
                          <span className={styles.quantityValue}>
                            {ligne.quantite}
                          </span>
                          <button
                            className={styles.quantityButton}
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                ligne.produitId,
                                ligne.quantite + 1,
                              )
                            }
                            aria-label={`Augmenter la quantite de ${ligne.nom}`}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{formatPrice(ligne.prix * ligne.quantite)}</td>
                      <td>
                        <button
                          className={styles.dangerButton}
                          type="button"
                          onClick={() => removeFromCart(ligne.produitId)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className={styles.cartFooter}>
              <div>
                <span className={styles.totalLabel}>Montant total</span>
                <strong className={styles.totalAmount}>
                  {formatPrice(montantTotal)}
                </strong>
              </div>
              <button
                className={styles.primaryButton}
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleSubmitOrder()}
              >
                {isSubmitting ? 'Commande en cours...' : 'Passer la commande'}
              </button>
            </footer>
          </>
        )}
      </section>
    </main>
  )
}
