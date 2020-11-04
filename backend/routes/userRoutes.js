// import express from 'express'
// import { authUser, getUserProfile, registerUser, updateUserProfile } from '../controllers/userController.js'
// import { protect } from '../middleware/authMiddleware.js'

// const router = express.Router()


// router.post('/login', authUser)

// router.route('/').post(registerUser)

// router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)


// export default router


import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers


} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router
    .route('/')
    .post(registerUser)
    .get(protect, admin, getUsers)
router
    .post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

export default router