import express from "express"

const router = express.Router()
import { register , login, logout, forgetPassword, resetPassword } from "../controller/userController.js"
import { validateLoginInput, validateRegisterInput } from "../middleware/validationMiddleware.js"



router.route("/register").post( validateRegisterInput ,  register)
router.route("/login").post( validateLoginInput , login)
router.route("/logout").post( logout)
router.route("/forgetPassword").post(forgetPassword)
router.route("/resetPassword/:resetToken").put(resetPassword)


export default router