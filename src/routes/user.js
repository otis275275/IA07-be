import { Router } from "express";
import UserController from "../controllers/UserController.js";
import authorize from "../middlewares/authorize.js";
const router = Router()
router.get('/user', authorize, UserController.getUser)

export default router;