import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { IconType } from 'react-icons'
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineDocumentText,
  HiOutlineUsers,
} from 'react-icons/hi'
import styles from './AdminSidebar.module.css'

interface NavigationItem {
  label: string
  to: string
  icon: IconType
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: HiOutlineChartBar },
  { label: 'Produits', to: '/admin/produits', icon: HiOutlineCube },
  { label: 'Commandes', to: '/admin/commandes', icon: HiOutlineShoppingCart },
  { label: 'Factures', to: '/admin/factures', icon: HiOutlineDocumentText },
  { label: 'Utilisateurs', to: '/admin/utilisateurs', icon: HiOutlineUsers },
]

function AdminSidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <>
      <button
        type="button"
        className={`${styles.mobileToggle} ${isOpen ? styles.mobileToggleOpen : ''}`}
        aria-label={isOpen ? 'Fermer le menu admin' : 'Ouvrir le menu admin'}
        aria-controls="admin-sidebar-navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <button
        type="button"
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        aria-label="Fermer le menu"
        onClick={() => setIsOpen(false)}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.header}>
          <NavLink
            to="/admin/dashboard"
            className={styles.brand}
            aria-label="Aller au dashboard admin"
          >
            <span className={styles.brandMark}>PF</span>
            <div className={styles.brandMeta}>
              <span className={styles.brandTitle}>ProduitFlow</span>
              <span className={styles.brandBadge}>Administration</span>
            </div>
          </NavLink>
        </div>

        <nav
          id="admin-sidebar-navigation"
          className={styles.nav}
          aria-label="Navigation administrateur"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
                }
              >
                <span className={styles.iconWrapper} aria-hidden="true">
                  <Icon className={styles.icon} />
                </span>
                <span className={styles.label}>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className={styles.footer}>
          <p className={styles.footerTitle}>Espace admin</p>
          <p className={styles.footerText}>
            Gere les produits, commandes, factures et utilisateurs depuis un
            menu centralise.
          </p>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
