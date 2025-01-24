import express from "express";
import {
  loginItemController,
  registerController,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginItemController);

router.post("/register", registerController);

export default router;
