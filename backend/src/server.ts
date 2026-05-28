import cors from 'cors'
import dotenv from 'dotenv'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import commandeRoutes from './routes/commandeRoutes'
import factureRoutes from './routes/factureRoutes'
import produitRoutes from './routes/produitRoutes'
import userRoutes from './routes/userRoutes'

dotenv.config()

const app = express()
const port = process.env.PORT ?? 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ProduitFlow API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/produits', produitRoutes)
app.use('/api/users', userRoutes)
app.use('/api/commandes', commandeRoutes)
app.use('/api/factures', factureRoutes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route introuvable' })
})

app.use(
  (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
    })
  },
)

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur lance sur le port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Erreur de connexion MongoDB', error)
    process.exit(1)
  })
