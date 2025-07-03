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
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 */

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

export default userRouter;
