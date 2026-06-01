import { isAxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import api, { setAuthToken } from '../../../api/axios'
import { useAuth } from '../../../features/auth/AuthContext'
import type { User } from '../../../types'
import styles from './Utilisateurs.module.css'

interface ApiErrorResponse {
  message?: string
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? fallback
  }

  return fallback
}

export default function Utilisateurs() {
  const { state } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthToken(state.token)
  }, [state.token])

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await api.get<User[]>('/users')
        setUsers(response.data)
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError,
            'Impossible de charger les utilisateurs.',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUsers()
  }, [])

  const visibleUsers = useMemo(
    () => users.filter((user) => user.id !== state.user?.id),
    [state.user?.id, users],
  )

  async function handleToggleStatus(user: User) {
    try {
      setUpdatingId(user.id)
      setError(null)
      const response = await api.put<User>(`/users/${user.id}/bloquer`)

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id ? response.data : currentUser,
        ),
      )
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          user.actif
            ? 'Impossible de bloquer cet utilisateur.'
            : 'Impossible de débloquer cet utilisateur.',
        ),
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(user: User) {
    const shouldDelete = window.confirm(
      `Supprimer l utilisateur "${user.nom}" ?`,
    )

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingId(user.id)
      setError(null)
      await api.delete(`/users/${user.id}`)
      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      )
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Impossible de supprimer cet utilisateur.',
        ),
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Administration</p>
          <h1>Gestion des utilisateurs</h1>
        </div>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <section className={styles.tablePanel}>
        {isLoading ? (
          <div className={styles.loading}>Chargement des utilisateurs...</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.length === 0 ? (
                  <tr>
                    <td className={styles.empty} colSpan={5}>
                      Aucun utilisateur disponible.
                    </td>
                  </tr>
                ) : (
                  visibleUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.nom}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            user.role === 'admin'
                              ? styles.roleAdmin
                              : styles.roleUser
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            user.actif
                              ? styles.statusActive
                              : styles.statusInactive
                          }`}
                        >
                          {user.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={
                              user.actif
                                ? styles.secondaryButton
                                : styles.primaryButton
                            }
                            type="button"
                            disabled={updatingId === user.id}
                            onClick={() => void handleToggleStatus(user)}
                          >
                            {updatingId === user.id
                              ? 'Mise à jour...'
                              : user.actif
                                ? 'Bloquer'
                                : 'Débloquer'}
                          </button>
                          <button
                            className={styles.dangerButton}
                            type="button"
                            disabled={deletingId === user.id}
                            onClick={() => void handleDelete(user)}
                          >
                            {deletingId === user.id
                              ? 'Suppression...'
                              : 'Supprimer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
