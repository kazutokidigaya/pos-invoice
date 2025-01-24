import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    cartItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Bills = mongoose.model("Bills", billSchema);

export default Bills;
