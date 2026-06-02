import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import Navbar from './Navbar'
import styles from './AdminLayout.module.css'

function AdminLayout() {
  return (
    <div className={styles.layout}>
      <Navbar offsetForSidebar />

      <div className={styles.body}>
        <div className={styles.sidebarSlot}>
          <AdminSidebar />
        </div>

        <main className={styles.main} aria-label="Contenu principal administrateur">
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
