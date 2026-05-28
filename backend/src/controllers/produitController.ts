import type { Request, Response } from 'express'
import Produit from '../models/Produit'

export async function getAllProduits(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const produits = await Produit.find().sort({ createdAt: -1 })
    res.json(produits)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

export async function getProduitById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const produit = await Produit.findById(req.params.id)

    if (!produit) {
      res.status(404).json({ message: 'Produit introuvable' })
      return
    }

    res.json(produit)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

export async function createProduit(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const produit = await Produit.create(req.body)
    res.status(201).json(produit)
  } catch (error) {
    res.status(400).json({ message: 'Donnees produit invalides', error })
  }
}

export async function updateProduit(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!produit) {
      res.status(404).json({ message: 'Produit introuvable' })
      return
    }

    res.json(produit)
  } catch (error) {
    res.status(400).json({ message: 'Donnees produit invalides', error })
  }
}

export async function deleteProduit(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id)

    if (!produit) {
      res.status(404).json({ message: 'Produit introuvable' })
      return
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}
