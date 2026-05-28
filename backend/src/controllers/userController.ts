import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import User from '../models/User'

export async function getAllUsers(
  _req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

export async function bloquerUser(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable' })
      return
    }

    user.actif = false
    await user.save()

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}

export async function deleteUser(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable' })
      return
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error })
  }
}
