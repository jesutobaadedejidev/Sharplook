import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create users
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.post("/register", registerUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create users
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

export default userRouter;
