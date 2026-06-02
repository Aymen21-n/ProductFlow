import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import styles from './UserLayout.module.css'

function UserLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.main} aria-label="Contenu principal utilisateur">
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default UserLayout
