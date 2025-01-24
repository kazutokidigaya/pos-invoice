import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import Items from "./models/itemModel.js";
import items from "./utils/data.js";

dotenv.config();
connectDb();

const importData = async () => {
  try {
    await Items.deleteMany();
    const itemsData = await Items.insertMany(items);
    console.log("Successfully Added Items");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
importData();
