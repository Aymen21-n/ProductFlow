export interface User {
  id: string
  nom: string
  email: string
  password: string
  role: 'admin' | 'user'
  actif: boolean
}

export interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  stock: number
  image: string
  categorie: string
}

export interface LignePanier {
  produitId: string
  nom: string
  prix: number
  quantite: number
  image: string
}

export interface Commande {
  id: string
  userId: string
  userName?: string
  lignes: LignePanier[]
  montantTotal: number
  statut: 'en_attente' | 'approuvee' | 'refusee'
  date: string
}

export interface Facture {
  id: string
  commandeId: string
  userId: string | { _id: string; nom: string }
  montantTotal: number
  lignes: LignePanier[]
  date: string
}
