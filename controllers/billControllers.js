import Bills from "../models/billModel.js";

export const addBillsController = async (req, res) => {
  try {
    const { firstName, lastName, phone, grandTotal, paymentMode, cartItems } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !grandTotal ||
      !paymentMode ||
      !cartItems
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBill = new Bills({
      firstName,
      lastName,
      phone,
      grandTotal,
      paymentMode,
      cartItems, // Save cart items
    });

    await newBill.save();
    res.status(201).json("Bill Created Successfully");
  } catch (error) {
    console.error("Error in addBillsController", error);
    res.status(400).json("Error", error);
  }
};

export const getBillsController = async (req, res) => {
  try {
    const items = await Bills.find();
    res.status(200).json(items);
  } catch (error) {
    console.log("Error in getItemController", error);
  }
};
