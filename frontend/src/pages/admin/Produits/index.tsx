import { isAxiosError } from 'axios'
import { useEffect, useState, type FormEvent } from 'react'
import api, { setAuthToken } from '../../../api/axios'
import { useAuth } from '../../../features/auth/AuthContext'
import type { Produit } from '../../../types'
import styles from './Produits.module.css'

interface ProduitFormState {
  nom: string
  description: string
  prix: string
  stock: string
  image: string
  categorie: string
}

interface ApiErrorResponse {
  message?: string
}

const emptyForm: ProduitFormState = {
  nom: '',
  description: '',
  prix: '',
  stock: '',
  image: '',
  categorie: '',
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? fallback
  }

  return fallback
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export default function Produits() {
  const { state } = useAuth()
  const [produits, setProduits] = useState<Produit[]>([])
  const [form, setForm] = useState<ProduitFormState>(emptyForm)
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthToken(state.token)
  }, [state.token])

  useEffect(() => {
    async function fetchProduits() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await api.get<Produit[]>('/produits')
        setProduits(response.data)
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError,
            'Impossible de charger les produits.',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProduits()
  }, [])

  function openCreateModal() {
    setEditingProduit(null)
    setForm(emptyForm)
    setError(null)
    setIsModalOpen(true)
  }

  function openEditModal(produit: Produit) {
    setEditingProduit(produit)
    setForm({
      nom: produit.nom,
      description: produit.description,
      prix: String(produit.prix),
      stock: String(produit.stock),
      image: produit.image,
      categorie: produit.categorie,
    })
    setError(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    if (isSubmitting) {
      return
    }

    setIsModalOpen(false)
    setEditingProduit(null)
    setForm(emptyForm)
  }

  function updateField(field: keyof ProduitFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload = {
      nom: form.nom.trim(),
      description: form.description.trim(),
      prix: Number(form.prix),
      stock: Number(form.stock),
      image: form.image.trim(),
      categorie: form.categorie.trim(),
    }

    try {
      setIsSubmitting(true)
      setError(null)

      if (editingProduit) {
        const response = await api.put<Produit>(
          `/produits/${editingProduit.id}`,
          payload,
        )
        setProduits((currentProduits) =>
          currentProduits.map((produit) =>
            produit.id === editingProduit.id ? response.data : produit,
          ),
        )
      } else {
        const response = await api.post<Produit>('/produits', payload)
        setProduits((currentProduits) => [response.data, ...currentProduits])
      }

      setIsModalOpen(false)
      setEditingProduit(null)
      setForm(emptyForm)
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          editingProduit
            ? 'Impossible de modifier le produit.'
            : 'Impossible d ajouter le produit.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(produit: Produit) {
    const shouldDelete = window.confirm(
      `Supprimer le produit "${produit.nom}" ?`,
    )

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingId(produit.id)
      setError(null)
      await api.delete(`/produits/${produit.id}`)
      setProduits((currentProduits) =>
        currentProduits.filter((currentProduit) => currentProduit.id !== produit.id),
      )
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, 'Impossible de supprimer le produit.'),
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
          <h1>Gestion des produits</h1>
        </div>
        <button className={styles.primaryButton} type="button" onClick={openCreateModal}>
          Ajouter un produit
        </button>
      </header>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <section className={styles.tablePanel}>
        {isLoading ? (
          <div className={styles.loading}>Chargement des produits...</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Categorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {produits.length === 0 ? (
                  <tr>
                    <td className={styles.empty} colSpan={6}>
                      Aucun produit disponible.
                    </td>
                  </tr>
                ) : (
                  produits.map((produit) => (
                    <tr key={produit.id}>
                      <td>
                        <img
                          className={styles.productImage}
                          src={produit.image}
                          alt={produit.nom}
                        />
                      </td>
                      <td>
                        <strong>{produit.nom}</strong>
                      </td>
                      <td>{produit.categorie}</td>
                      <td>{formatPrice(produit.prix)}</td>
                      <td>
                        <span className={styles.stock}>{produit.stock}</span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.secondaryButton}
                            type="button"
                            onClick={() => openEditModal(produit)}
                          >
                            Modifier
                          </button>
                          <button
                            className={styles.dangerButton}
                            type="button"
                            disabled={deletingId === produit.id}
                            onClick={() => void handleDelete(produit)}
                          >
                            {deletingId === produit.id ? 'Suppression...' : 'Supprimer'}
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

      {isModalOpen && (
        <div className={styles.modalOverlay} role="presentation">
          <section
            className={styles.modal}
            aria-labelledby="produit-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.modalHeader}>
              <h2 id="produit-modal-title">
                {editingProduit ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button className={styles.closeButton} type="button" onClick={closeModal}>
                Fermer
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>Nom</span>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(event) => updateField('nom', event.target.value)}
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  required
                />
              </label>

              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Prix</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.prix}
                    onChange={(event) => updateField('prix', event.target.value)}
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Stock</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) => updateField('stock', event.target.value)}
                    required
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span>Image (URL)</span>
                <input
                  type="url"
                  value={form.image}
                  onChange={(event) => updateField('image', event.target.value)}
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Categorie</span>
                <input
                  type="text"
                  value={form.categorie}
                  onChange={(event) =>
                    updateField('categorie', event.target.value)
                  }
                  required
                />
              </label>

              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                <button
                  className={styles.primaryButton}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}
