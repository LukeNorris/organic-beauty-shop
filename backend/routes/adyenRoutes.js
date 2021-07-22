
import express from 'express'
const router = express.Router()
import {
paymentLink,
makeTerminalPayment,
handleShopperRedirect,
getPaymentMethods,
initiatePayment
//   makePayment,
//   addDetails,
} from '../controllers/adyenController.js'

import { protect } from '../middleware/authMiddleware.js'

router.route('/paymentLink').post(protect, paymentLink)
router.route('/makeTerminalPayment').post(protect, makeTerminalPayment)
router.route('/getPaymentMethods').post(protect, getPaymentMethods)
router.route('/initiatePayment').post(protect, initiatePayment)
router.route('/handleShopperRedirect').all(handleShopperRedirect)
// router.route('/makePayment').post(protect, makePayment)
// router.route('/addDetails').post(protect, addDetails)

export default router
