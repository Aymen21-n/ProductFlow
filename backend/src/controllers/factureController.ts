import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import Facture from '../models/Facture'

export async function getAllFactures(
  _req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const factures = await Facture.find().sort({ createdAt: -1 })
    res.json(factures)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

export async function getFacturesByUser(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const factures = await Facture.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    })
    res.json(factures)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

export async function getFactureById(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const facture = await Facture.findById(req.params.id)

    if (!facture) {
      res.status(404).json({ message: 'Facture introuvable' })
      return
    }

    res.json(facture)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}
