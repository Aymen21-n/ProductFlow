import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User, { type IUser } from '../models/User'

interface JwtPayload {
  id: string
}

export interface AuthRequest extends Request {
  user?: IUser
}

export async function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token manquant' })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Token manquant' })
    return
  }

  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      res.status(500).json({ message: 'JWT_SECRET est manquant' })
      return
    }

    const decoded = jwt.verify(token, secret) as JwtPayload
    const user = await User.findById(decoded.id)

    if (!user || !user.actif) {
      res.status(401).json({ message: 'Utilisateur non autorise' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Token invalide' })
  }
}

export function adminOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Acces admin requis' })
    return
  }

  next()
}
