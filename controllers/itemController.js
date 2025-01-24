import Items from "../models/itemModel.js";

export const getItemController = async (req, res) => {
  try {
    const items = await Items.find();
    res.status(200).json(items);
  } catch (error) {
    console.log("Error in getItemController", error);
  }
};

export const addItemController = async (req, res) => {
  try {
    const { name, price, category, image } = req.body;
    if (!name || !price || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newItem = new Items(req.body);
    await newItem.save();
    res.status(201).json("Item created Successfully");
  } catch (error) {
    console.log("Error in addItemController", error);
    res.status(400).json("Error", error);
  }
};

export const updateItemController = async (req, res) => {
  try {
    // Validate itemId
    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    // Validate update fields (you can add more specific validations here)
    const { name, price, category, image } = req.body;
    if (!name || !price || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update item in the database
    const updatedItem = await Items.findOneAndUpdate(
      { _id: itemId }, // Use the ID from req.params
      { name, price, category, image }, // Only update these fields
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error in updateItemController:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteItemController = async (req, res) => {
  try {
    // Validate itemId
    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const deleteItem = await Items.findOneAndDelete({ _id: itemId });

    if (!deleteItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item Deleted successfully", deleteItem });
  } catch (error) {
    console.error("Error in deleteItemController:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
