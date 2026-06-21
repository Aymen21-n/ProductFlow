import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import Commande, { type StatutCommande } from '../models/Commande'
import Facture from '../models/Facture'
import Produit from '../models/Produit'

async function createFactureFromCommande(commandeId: string): Promise<void> {
  const commande = await Commande.findById(commandeId)

  if (!commande || commande.statut !== 'approuvee') {
    return
  }

  const existingFacture = await Facture.findOne({ commandeId: commande.id })

  if (existingFacture) {
    return
  }

  await Facture.create({
    commandeId: commande.id,
    userId: commande.userId,
    montantTotal: commande.montantTotal,
    lignes: commande.lignes,
    date: new Date(),
  })
}

export async function getAllCommandes(
  _req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const commandes = await Commande.find()
      .populate('userId', 'nom')
      .sort({ date: -1 })
    res.json(commandes)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

export async function getCommandesByUser(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const commandes = await Commande.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    })
    res.json(commandes)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

export async function createCommande(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const commande = await Commande.create({
      ...req.body,
      userId: req.body.userId ?? req.user?.id,
    })

    res.status(201).json(commande)
  } catch (error) {
    res.status(400).json({ message: 'Donnees commande invalides', error })
  }
}

export async function updateStatutCommande(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { statut } = req.body as { statut?: StatutCommande }

    if (!statut || !['en_attente', 'approuvee', 'refusee'].includes(statut)) {
      res.status(400).json({ message: 'Statut invalide' })
      return
    }

    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true, runValidators: true },
    )

    if (!commande) {
      res.status(404).json({ message: 'Commande introuvable' })
      return
    }

    if (statut === 'approuvee') {
      for (const ligne of commande.lignes) {
        await Produit.findByIdAndUpdate(ligne.produitId, {
          $inc: { stock: -ligne.quantite },
        })
      }

      await createFactureFromCommande(commande.id)
    }

    res.json(commande)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}
