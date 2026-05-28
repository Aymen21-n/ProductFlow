import { Router } from 'express'
import {
  getAllFactures,
  getFactureById,
  getFacturesByUser,
} from '../controllers/factureController'
import { adminOnly, protect } from '../middleware/auth'

const router = Router()

router.get('/', protect, adminOnly, getAllFactures)
router.get('/user/:userId', protect, getFacturesByUser)
router.get('/:id', protect, getFactureById)

export default router
