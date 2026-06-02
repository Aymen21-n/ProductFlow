import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import { getProduits } from '../../../services/produitService'
import type { Produit } from '../../../types'
import styles from './index.module.css'

const SKELETON_COUNT = 6

function formatPrice(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function parsePriceInput(value: string) {
  if (value.trim() === '') {
    return null
  }

  const parsedValue = Number.parseFloat(value)

  return Number.isNaN(parsedValue) ? null : parsedValue
}

function Catalogue() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => {
    let isActive = true

    async function fetchProduits() {
      setLoading(true)
      setError(null)

      try {
        const data = await getProduits()

        if (!isActive) {
          return
        }

        setProduits(data)
      } catch (fetchError) {
        if (!isActive) {
          return
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Impossible de charger le catalogue.',
        )
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchProduits()

    return () => {
      isActive = false
    }
  }, [refreshIndex])

  const categories = Array.from(
    new Set(
      produits
        .map((produit) => produit.categorie.trim())
        .filter((categorie) => categorie.length > 0),
    ),
  ).sort((a, b) => a.localeCompare(b, 'fr'))

  const minimumPrice = parsePriceInput(minPrice)
  const maximumPrice = parsePriceInput(maxPrice)
  const normalizedSearch = search.trim().toLowerCase()

  const filteredProduits = produits.filter((produit) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      produit.nom.toLowerCase().includes(normalizedSearch)

    const matchesCategorie =
      selectedCategorie === '' || produit.categorie === selectedCategorie

    const matchesMinPrice =
      minimumPrice === null || produit.prix >= minimumPrice

    const matchesMaxPrice =
      maximumPrice === null || produit.prix <= maximumPrice

    return (
      matchesSearch &&
      matchesCategorie &&
      matchesMinPrice &&
      matchesMaxPrice
    )
  })

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategorie !== '' ||
    minPrice.trim() !== '' ||
    maxPrice.trim() !== ''

  const handleResetFilters = () => {
    setSearch('')
    setSelectedCategorie('')
    setMinPrice('')
    setMaxPrice('')
  }

  const emptyMessage =
    produits.length === 0
      ? 'Aucun produit disponible pour le moment.'
      : 'Aucun produit ne correspond a vos filtres.'

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Catalogue</p>
          <h1 className={styles.title}>Decouvrez nos produits</h1>
          <p className={styles.subtitle}>
            Explorez le catalogue, filtrez par categorie ou par prix, puis
            ouvrez la fiche detail de chaque produit.
          </p>
        </div>

        <div className={styles.heroMeta}>
          <span className={styles.resultsBadge}>
            {loading
              ? 'Chargement du catalogue...'
              : `${filteredProduits.length} produit${filteredProduits.length > 1 ? 's' : ''} affiche${filteredProduits.length > 1 ? 's' : ''}`}
          </span>

          {!loading && hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={handleResetFilters}>
              Reinitialiser
            </Button>
          )}
        </div>
      </div>

      <div className={styles.filters}>
        <label className={styles.field}>
          <span className={styles.label}>Recherche</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher par nom..."
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Categorie</span>
          <select
            value={selectedCategorie}
            onChange={(event) => setSelectedCategorie(event.target.value)}
            className={styles.select}
          >
            <option value="">Toutes les categories</option>
            {categories.map((categorie) => (
              <option key={categorie} value={categorie}>
                {categorie}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Prix minimum</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="0"
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Prix maximum</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="1000"
            className={styles.input}
          />
        </label>
      </div>

      {error ? (
        <div className={styles.stateCard} role="alert">
          <h2 className={styles.stateTitle}>Chargement impossible</h2>
          <p className={styles.stateMessage}>{error}</p>
          <Button onClick={() => setRefreshIndex((value) => value + 1)}>
            Reessayer
          </Button>
        </div>
      ) : loading ? (
        <div className={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <article key={`skeleton-${index}`} className={styles.card}>
              <div className={styles.skeletonImage} />
              <div className={styles.cardBody}>
                <span className={styles.skeletonLineShort} />
                <span className={styles.skeletonLine} />
                <span className={styles.skeletonLineMedium} />
                <span className={styles.skeletonButton} />
              </div>
            </article>
          ))}
        </div>
      ) : filteredProduits.length === 0 ? (
        <div className={styles.stateCard}>
          <h2 className={styles.stateTitle}>Aucun produit a afficher</h2>
          <p className={styles.stateMessage}>{emptyMessage}</p>
          {hasActiveFilters && (
            <Button variant="secondary" onClick={handleResetFilters}>
              Effacer les filtres
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProduits.map((produit) => (
            <article key={produit.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={produit.image}
                  alt={produit.nom}
                  className={styles.image}
                />
                <span className={styles.categoryBadge}>{produit.categorie}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{produit.nom}</h2>
                  <p className={styles.price}>{formatPrice(produit.prix)}</p>
                </div>

                <p className={styles.description}>{produit.description}</p>

                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Stock disponible</span>
                  <span
                    className={`${styles.stockValue} ${
                      produit.stock < 5 ? styles.lowStock : styles.goodStock
                    }`}
                  >
                    {produit.stock}
                  </span>
                </div>

                <Button
                  onClick={() => navigate(`/user/produit/${produit.id}`)}
                >
                  Voir detail
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Catalogue
