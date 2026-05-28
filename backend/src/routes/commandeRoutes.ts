import { Router } from 'express'
import {
  createCommande,
  getAllCommandes,
  getCommandesByUser,
  updateStatutCommande,
} from '../controllers/commandeController'
import { adminOnly, protect } from '../middleware/auth'

const router = Router()

router.get('/', protect, adminOnly, getAllCommandes)
router.get('/user/:userId', protect, getCommandesByUser)
router.post('/', protect, createCommande)
router.put('/:id/statut', protect, adminOnly, updateStatutCommande)

export default router
