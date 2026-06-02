import { useEffect, useState } from 'react'
import {
  HiOutlineCube,
  HiOutlineExclamationCircle,
  HiOutlineShoppingCart,
  HiOutlineUsers,
} from 'react-icons/hi'
import { PiCurrencyCircleDollarBold } from 'react-icons/pi'
import api from '../../../api/axios'
import Button from '../../../components/ui/Button'
import type { Commande, Produit, User } from '../../../types'
import styles from './index.module.css'

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value)
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function Dashboard() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => {
    let isActive = true

    async function fetchDashboardData() {
      setLoading(true)
      setError(null)

      try {
        const [commandesResponse, usersResponse, produitsResponse] =
          await Promise.all([
            api.get<Commande[]>('/commandes'),
            api.get<User[]>('/users'),
            api.get<Produit[]>('/produits'),
          ])

        if (!isActive) {
          return
        }

        setCommandes(commandesResponse.data)
        setUsers(usersResponse.data)
        setProduits(produitsResponse.data)
      } catch {
        if (!isActive) {
          return
        }

        setError(
          'Impossible de charger les statistiques du dashboard pour le moment.',
        )
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    return () => {
      isActive = false
    }
  }, [refreshIndex])

  const totalCommandes = commandes.length
  const totalRevenus = commandes.reduce(
    (total, commande) => total + commande.montantTotal,
    0,
  )
  const stockFaible = produits.filter((produit) => produit.stock < 5).length
  const totalUtilisateurs = users.length

  const stats = [
    {
      label: 'Commandes totales',
      value: formatNumber(totalCommandes),
      note: 'Toutes les commandes enregistrees',
      icon: HiOutlineShoppingCart,
      tone: styles.blueCard,
    },
    {
      label: 'Revenus totaux',
      value: formatAmount(totalRevenus),
      note: 'Somme des montantTotal cumules',
      icon: PiCurrencyCircleDollarBold,
      tone: styles.greenCard,
    },
    {
      label: 'Stock faible',
      value: formatNumber(stockFaible),
      note: 'Produits avec un stock inferieur a 5',
      icon: HiOutlineExclamationCircle,
      tone: styles.orangeCard,
    },
    {
      label: 'Utilisateurs',
      value: formatNumber(totalUtilisateurs),
      note: 'Comptes utilisateurs disponibles',
      icon: HiOutlineUsers,
      tone: styles.purpleCard,
    },
  ]

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Vue d'ensemble</p>
          <h1 className={styles.title}>Dashboard administrateur</h1>
          <p className={styles.subtitle}>
            Suivez les indicateurs cles de ProduitFlow en un coup d'oeil.
          </p>
        </div>

        <div className={styles.heroMeta}>
          <span className={styles.metaChip}>
            <HiOutlineCube className={styles.metaIcon} />
            {loading ? 'Synchronisation en cours' : 'Donnees chargees'}
          </span>

          {!loading && !error && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRefreshIndex((value) => value + 1)}
            >
              Actualiser
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <div className={styles.errorCard} role="alert">
          <div className={styles.errorContent}>
            <span className={styles.errorIconWrap}>
              <HiOutlineExclamationCircle className={styles.errorIcon} />
            </span>
            <div>
              <h2 className={styles.errorTitle}>Chargement interrompu</h2>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          </div>

          <Button onClick={() => setRefreshIndex((value) => value + 1)}>
            Reessayer
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon

            return (
              <article
                key={stat.label}
                className={`${styles.card} ${stat.tone}`}
              >
                {loading ? (
                  <>
                    <div className={styles.cardTop}>
                      <span className={styles.skeletonIcon} />
                      <span className={styles.skeletonLineShort} />
                    </div>
                    <span className={styles.skeletonValue} />
                    <span
                      className={styles.skeletonLine}
                      style={{ width: `${68 + (index % 2) * 10}%` }}
                    />
                  </>
                ) : (
                  <>
                    <div className={styles.cardTop}>
                      <span className={styles.iconWrap}>
                        <Icon className={styles.cardIcon} />
                      </span>
                      <span className={styles.cardLabel}>{stat.label}</span>
                    </div>

                    <strong className={styles.cardValue}>{stat.value}</strong>
                    <p className={styles.cardNote}>{stat.note}</p>
                  </>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Dashboard
