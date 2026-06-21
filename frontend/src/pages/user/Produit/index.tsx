import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { getProduitById } from '../../../services/produitService'
import { useCartStore } from '../../../store/cartStore'
import type { Produit as ProduitType } from '../../../types'
import styles from './index.module.css'

function formatPrice(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function Produit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addToCart = useCartStore((state) => state.addToCart)
  const successTimeoutRef = useRef<number | null>(null)
  const [produit, setProduit] = useState<ProduitType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [quantite, setQuantite] = useState(1)
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => {
    let isActive = true

    async function fetchProduit() {
      if (!id) {
        setError('Produit introuvable.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await getProduitById(id)

        if (!isActive) {
          return
        }

        setProduit(data)
      } catch (fetchError) {
        if (!isActive) {
          return
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Impossible de charger ce produit.',
        )
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchProduit()

    return () => {
      isActive = false
    }
  }, [id, refreshIndex])

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current !== null) {
        window.clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  const handleAddToCart = () => {
    if (!produit) {
      return
    }

    for (let i = 0; i < quantite; i++) {
      addToCart({
        produitId: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        image: produit.image,
      })
    }

    setShowSuccessMessage(true)

    if (successTimeoutRef.current !== null) {
      window.clearTimeout(successTimeoutRef.current)
    }

    successTimeoutRef.current = window.setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.skeletonLayout}>
          <div className={styles.skeletonImage} />

          <div className={styles.skeletonPanel}>
            <span className={styles.skeletonBadge} />
            <span className={styles.skeletonTitle} />
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLineShort} />
            <span className={styles.skeletonPrice} />
            <span className={styles.skeletonMeta} />
            <div className={styles.skeletonActions}>
              <span className={styles.skeletonButtonPrimary} />
              <span className={styles.skeletonButtonSecondary} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !produit) {
    return (
      <section className={styles.page}>
        <div className={styles.stateCard} role="alert">
          <h1 className={styles.stateTitle}>Chargement impossible</h1>
          <p className={styles.stateMessage}>
            {error ?? 'Le produit demande est indisponible.'}
          </p>
          <div className={styles.stateActions}>
            <Button onClick={() => setRefreshIndex((value) => value + 1)}>
              Reessayer
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/user/catalogue')}
            >
              Retour au catalogue
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.visualPanel}>
          <div className={styles.imageWrap}>
            <img
              src={produit.image}
              alt={produit.nom}
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.contentPanel}>
          <span className={styles.categoryBadge}>{produit.categorie}</span>
          <h1 className={styles.title}>{produit.nom}</h1>
          <p className={styles.description}>{produit.description}</p>

          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>Prix</span>
            <strong className={styles.price}>{formatPrice(produit.prix)}</strong>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>Stock</span>
              <span
                className={`${styles.metaValue} ${
                  produit.stock === 0
                    ? styles.outOfStock
                    : produit.stock < 5
                      ? styles.lowStock
                      : styles.goodStock
                }`}
              >
                {produit.stock === 0
                  ? 'Rupture de stock'
                  : `${produit.stock} disponible${produit.stock > 1 ? 's' : ''}`}
              </span>
            </div>

            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>Categorie</span>
              <span className={styles.metaText}>{produit.categorie}</span>
            </div>
          </div>

          {showSuccessMessage && (
            <div className={styles.successMessage} role="status">
              Produit ajouté au panier !
            </div>
          )}

          <div className={styles.quantitySelector}>
            <span className={styles.metaLabel}>Quantité</span>
            <div className={styles.quantityControls}>
              <button
                type="button"
                onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                disabled={quantite <= 1}
              >
                -
              </button>
              <span>{quantite}</span>
              <button
                type="button"
                onClick={() => setQuantite((q) => Math.min(produit.stock, q + 1))}
                disabled={quantite >= produit.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              onClick={handleAddToCart}
              disabled={produit.stock === 0}
            >
              Ajouter au panier
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate('/user/catalogue')}
            >
              Retour au catalogue
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Produit
