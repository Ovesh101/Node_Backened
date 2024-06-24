import express from "express"

const router = express.Router()
import { getAllProducts , getProductById , updateUserCart , getUserProfile , deleteFromCart , paymentGateway, checkout } from "../controller/ProductController.js"
import { authenticateUser } from "../middleware/authMiddleware.js"



router.route("/product").get( authenticateUser , getAllProducts)
router.route("/product/:id").get(authenticateUser, getProductById)
router.post('/update-cart', authenticateUser, updateUserCart);
router.get('/me', authenticateUser, getUserProfile);

router.delete('/:productId', authenticateUser , deleteFromCart);

router.post('/checkout',authenticateUser , checkout);
router.post('/payment/:id',authenticateUser , paymentGateway);


export default router