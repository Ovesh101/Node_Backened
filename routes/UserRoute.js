import express from "express"

const router = express.Router()
import { register , login, logout } from "../controller/userController.js"
import { validateLoginInput, validateRegisterInput } from "../middleware/validationMiddleware.js"



router.route("/register").post( validateRegisterInput ,  register)
router.route("/login").post( validateLoginInput , login)
router.route("/logout").post( logout)


export default router