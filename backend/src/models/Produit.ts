import { Schema, model, type Document } from 'mongoose'

export interface IProduit extends Document {
  nom: string
  description: string
  prix: number
  stock: number
  image: string
  categorie: string
}

const produitSchema = new Schema<IProduit>(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    prix: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    categorie: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const produit = ret as Record<string, unknown>
        delete produit._id
        delete produit.__v
        return ret
      },
    },
    toObject: {
      virtuals: true,
    },
  },
)

export default model<IProduit>('Produit', produitSchema)
