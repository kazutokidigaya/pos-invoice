import express from "express";
import {
  addItemController,
  deleteItemController,
  getItemController,
  updateItemController,
} from "../controllers/itemController.js";

const router = express.Router();

router.get("/get-item", getItemController);

router.post("/add-item", addItemController);

router.put("/update-item/:itemId", updateItemController);

router.delete("/delete-item/:itemId", deleteItemController);

export default router;
