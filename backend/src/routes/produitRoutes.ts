import { Router } from 'express'
import {
  createProduit,
  deleteProduit,
  getAllProduits,
  getProduitById,
  updateProduit,
} from '../controllers/produitController'
import { adminOnly, protect } from '../middleware/auth'

const router = Router()

router.get('/', getAllProduits)
router.get('/:id', getProduitById)
router.post('/', protect, adminOnly, createProduit)
router.put('/:id', protect, adminOnly, updateProduit)
router.delete('/:id', protect, adminOnly, deleteProduit)

export default router
