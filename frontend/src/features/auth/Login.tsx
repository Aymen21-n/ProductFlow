import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import api, { setAuthToken } from '../../api/axios'
import type { User } from '../../types'
import { useAuth } from './AuthContext'
import styles from './Login.module.css'

interface LoginResponse {
  user: User
  token: string
}

interface ApiErrorResponse {
  message?: string
}

type AuthMode = 'login' | 'register'

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()

  const isRegisterMode = mode === 'register'

  function handleSuccess(user: User, token: string) {
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token },
    })
    setAuthToken(token)

    if (user.role === 'admin') {
      navigate('/admin/dashboard')
      return
    }

    navigate('/user/catalogue')
  }

  function toggleMode() {
    setMode((currentMode) =>
      currentMode === 'login' ? 'register' : 'login',
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch({ type: 'LOGIN_START' })

    try {
      const response = await api.post<LoginResponse>(
        isRegisterMode ? '/auth/register' : '/auth/login',
        isRegisterMode
          ? {
              nom,
              email,
              password,
              role: 'user',
            }
          : {
              email,
              password,
            },
      )
      const { user, token } = response.data

      handleSuccess(user, token)
    } catch (error) {
      let message = isRegisterMode
        ? 'Une erreur est survenue lors de l inscription.'
        : 'Une erreur est survenue lors de la connexion.'

      if (isAxiosError<ApiErrorResponse>(error)) {
        message = error.response?.data.message ?? message
      }

      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message,
      })
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="login-title">
        <div className={styles.header}>
          <span className={styles.brand}>ProduitFlow</span>
          <h1 id="login-title">
            {isRegisterMode ? 'Inscription' : 'Connexion'}
          </h1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isRegisterMode && (
            <label className={styles.field}>
              <span>Nom</span>
              <input
                type="text"
                value={nom}
                onChange={(event) => setNom(event.target.value)}
                placeholder="Votre nom"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nom@exemple.com"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              required
            />
          </label>

          {state.error && (
            <p className={styles.error} role="alert">
              {state.error}
            </p>
          )}

          <button className={styles.button} type="submit" disabled={state.loading}>
            {state.loading
              ? isRegisterMode
                ? 'Inscription...'
                : 'Connexion...'
              : isRegisterMode
                ? "S'inscrire"
                : 'Se connecter'}
          </button>

          <button
            className={styles.switchButton}
            type="button"
            onClick={toggleMode}
            disabled={state.loading}
          >
            {isRegisterMode
              ? 'Déjà un compte ? Se connecter'
              : "Pas encore de compte ? S'inscrire"}
          </button>
        </form>
      </section>
    </main>
  )
}
