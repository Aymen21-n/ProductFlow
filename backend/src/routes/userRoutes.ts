import { Router } from 'express'
import {
  bloquerUser,
  deleteUser,
  getAllUsers,
} from '../controllers/userController'
import { adminOnly, protect } from '../middleware/auth'

const router = Router()

router.get('/', protect, adminOnly, getAllUsers)
router.put('/:id/bloquer', protect, adminOnly, bloquerUser)
router.delete('/:id', protect, adminOnly, deleteUser)

export default router
