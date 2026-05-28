import { Schema, model, type Document } from 'mongoose'

export type StatutCommande = 'en_attente' | 'approuvee' | 'refusee'

export interface ILignePanier {
  produitId: string
  nom: string
  prix: number
  quantite: number
  image: string
}

export interface ICommande extends Document {
  userId: string
  lignes: ILignePanier[]
  montantTotal: number
  statut: StatutCommande
  date: Date
}

export const lignePanierSchema = new Schema<ILignePanier>(
  {
    produitId: {
      type: String,
      required: true,
    },
    nom: {
      type: String,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
      min: 0,
    },
    quantite: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
)

const commandeSchema = new Schema<ICommande>(
  {
    userId: {
      type: String,
      required: true,
    },
    lignes: {
      type: [lignePanierSchema],
      required: true,
      validate: {
        validator: (lignes: ILignePanier[]) => lignes.length > 0,
        message: 'Une commande doit contenir au moins une ligne',
      },
    },
    montantTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    statut: {
      type: String,
      enum: ['en_attente', 'approuvee', 'refusee'],
      default: 'en_attente',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const commande = ret as Record<string, unknown>
        delete commande._id
        delete commande.__v
        return ret
      },
    },
    toObject: {
      virtuals: true,
    },
  },
)

export default model<ICommande>('Commande', commandeSchema)
