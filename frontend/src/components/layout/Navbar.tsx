import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import type { User } from '../../types'
import styles from './Navbar.module.css'

interface NavigationItem {
  label: string
  to: string
}

const navigationByRole: Record<User['role'], NavigationItem[]> = {
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Produits', to: '/admin/produits' },
    { label: 'Commandes', to: '/admin/commandes' },
    { label: 'Factures', to: '/admin/factures' },
    { label: 'Utilisateurs', to: '/admin/utilisateurs' },
  ],
  user: [
    { label: 'Catalogue', to: '/user/catalogue' },
    { label: 'Panier', to: '/user/panier' },
    { label: 'Commandes', to: '/user/commandes' },
    { label: 'Factures', to: '/user/factures' },
  ],
}

const roleLabel: Record<User['role'], string> = {
  admin: 'Admin',
  user: 'User',
}

function Navbar() {
  const { state, dispatch } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = state.user

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  if (!user) {
    return null
  }

  const navigation = navigationByRole[user.role]
  const homeLink = navigation[0]?.to ?? '/'
  const initials = (user.nom.trim().charAt(0) || user.email.charAt(0)).toUpperCase()

  const handleLogout = () => {
    setIsMenuOpen(false)
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <header className={styles.header}>
      <div className={styles.shell}>
        <NavLink
          to={homeLink}
          className={styles.brand}
          aria-label="Aller à l'accueil ProduitFlow"
        >
          <span className={styles.brandMark}>PF</span>
          <span className={styles.brandText}>ProduitFlow</span>
        </NavLink>

        <button
          type="button"
          className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ''}`}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="primary-navigation"
          className={`${styles.panel} ${isMenuOpen ? styles.panelOpen : ''}`}
        >
          <nav className={styles.nav} aria-label="Navigation principale">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <div className={styles.userCard}>
              <span className={styles.avatar} aria-hidden="true">
                {initials}
              </span>
              <div className={styles.userMeta}>
                <span className={styles.userName}>{user.nom}</span>
                <span className={styles.userRole}>{roleLabel[user.role]}</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Deconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
