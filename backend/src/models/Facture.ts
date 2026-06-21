import { Schema, model, type Document, Types } from 'mongoose'
import { lignePanierSchema, type ILignePanier } from './Commande'

export interface IFacture extends Document {
  commandeId: string
  userId: Types.ObjectId
  montantTotal: number
  lignes: ILignePanier[]
  date: Date
}

const factureSchema = new Schema<IFacture>(
  {
    commandeId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    montantTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    lignes: {
      type: [lignePanierSchema],
      required: true,
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
        const facture = ret as Record<string, unknown>
        delete facture._id
        delete facture.__v
        return ret
      },
    },
    toObject: {
      virtuals: true,
    },
  },
)

export default model<IFacture>('Facture', factureSchema)
