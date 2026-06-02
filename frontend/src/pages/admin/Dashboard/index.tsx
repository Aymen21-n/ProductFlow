import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineShoppingCart,
  HiOutlineUsers,
} from 'react-icons/hi'
import { PiCurrencyCircleDollarBold } from 'react-icons/pi'
import api from '../../../api/axios'
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
      tone: styles.blueAccent,
    },
    {
      label: 'Revenus totaux',
      value: formatAmount(totalRevenus),
      note: 'Somme des montantTotal cumules',
      icon: PiCurrencyCircleDollarBold,
      tone: styles.greenAccent,
    },
    {
      label: 'Stock faible',
      value: formatNumber(stockFaible),
      note: 'Produits avec un stock inferieur a 5',
      icon: HiOutlineExclamationCircle,
      tone: styles.orangeAccent,
    },
    {
      label: 'Utilisateurs',
      value: formatNumber(totalUtilisateurs),
      note: 'Comptes utilisateurs disponibles',
      icon: HiOutlineUsers,
      tone: styles.slateAccent,
    },
  ]

  const quickLinks = [
    {
      label: 'Produits',
      description: 'Ajouter, modifier ou supprimer les produits du catalogue.',
      to: '/admin/produits',
      icon: HiOutlineCube,
    },
    {
      label: 'Commandes',
      description: 'Consulter et suivre les commandes passees.',
      to: '/admin/commandes',
      icon: HiOutlineShoppingCart,
    },
    {
      label: 'Factures',
      description: 'Acceder aux factures generees pour les commandes.',
      to: '/admin/factures',
      icon: HiOutlineDocumentText,
    },
    {
      label: 'Utilisateurs',
      description: 'Gerer les comptes, roles et statuts utilisateurs.',
      to: '/admin/utilisateurs',
      icon: HiOutlineUsers,
    },
  ]

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Administration</p>
          <h1>Dashboard administrateur</h1>
        </div>

        {!loading && !error && (
          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => setRefreshIndex((value) => value + 1)}
          >
            Actualiser
          </button>
        )}
      </header>

      {error ? (
        <section className={styles.errorPanel} role="alert">
          <p className={styles.error}>{error}</p>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => setRefreshIndex((value) => value + 1)}
          >
            Reessayer
          </button>
        </section>
      ) : (
        <section className={styles.statsPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Indicateurs cles</h2>
              <p>Vue d'ensemble des donnees principales de ProduitFlow.</p>
            </div>

            <span className={styles.statusChip}>
              <HiOutlineCube className={styles.statusIcon} />
              {loading ? 'Synchronisation en cours' : 'Donnees chargees'}
            </span>
          </div>

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
        </section>
      )}

      <section className={styles.quickLinksPanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Acces rapides</h2>
            <p>Ouvrez directement les espaces de gestion admin.</p>
          </div>
        </div>

        <div className={styles.quickGrid}>
          {quickLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link key={item.to} className={styles.quickCard} to={item.to}>
                <span className={styles.quickIcon} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.quickContent}>
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </span>
                <span className={styles.quickAction}>Ouvrir</span>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default Dashboard
