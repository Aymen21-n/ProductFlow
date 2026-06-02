import { create } from 'zustand'
import type { LignePanier } from '../types'

interface CartStore {
  items: LignePanier[]
  addToCart: (item: Omit<LignePanier, 'quantite'>) => void
  removeFromCart: (produitId: string) => void
  updateQuantity: (produitId: string, quantite: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (item) => {
    set((state) => {
      const existingItem = state.items.find(
        (cartItem) => cartItem.produitId === item.produitId,
      )

      if (existingItem) {
        return {
          items: state.items.map((cartItem) =>
            cartItem.produitId === item.produitId
              ? { ...cartItem, quantite: cartItem.quantite + 1 }
              : cartItem,
          ),
        }
      }

      return {
        items: [...state.items, { ...item, quantite: 1 }],
      }
    })
  },

  removeFromCart: (produitId) => {
    set((state) => ({
      items: state.items.filter((item) => item.produitId !== produitId),
    }))
  },

  updateQuantity: (produitId, quantite) => {
    if (quantite <= 0) {
      set((state) => ({
        items: state.items.filter((item) => item.produitId !== produitId),
      }))
      return
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.produitId === produitId ? { ...item, quantite } : item,
      ),
    }))
  },

  clearCart: () => {
    set({ items: [] })
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantite, 0)
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.prix * item.quantite,
      0,
    )
  },
}))
