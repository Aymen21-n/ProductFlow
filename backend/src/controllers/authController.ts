import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

function createToken(userId: string): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET est manquant')
  }

  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' })
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { nom, email, password, role } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      res.status(409).json({ message: 'Email deja utilise' })
      return
    }

    const user = await User.create({
      nom,
      email,
      password,
      role: role ?? 'user',
    })
    const token = createToken(user.id)

    res.status(201).json({ user, token })
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de l inscription',
      error: error instanceof Error ? error.message : error,
    })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      res.status(401).json({ message: 'Email ou mot de passe invalide' })
      return
    }

    if (!user.actif) {
      res.status(403).json({ message: 'Utilisateur bloque' })
      return
    }

    const passwordMatches = await user.comparePassword(password)

    if (!passwordMatches) {
      res.status(401).json({ message: 'Email ou mot de passe invalide' })
      return
    }

    const token = createToken(user.id)

    res.json({ user, token })
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la connexion',
      error: error instanceof Error ? error.message : error,
    })
  }
}
