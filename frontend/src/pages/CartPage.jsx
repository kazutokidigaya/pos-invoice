import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, deleteItem, clearCart } from "../redux/cartSlice";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CheckoutPage from "./CheckoutPage";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <button
        className="p-2 px-4 mb-4 mx-2   bg-white rounded hover:bg-black  hover:text-white shadow cursor-pointer"
        onClick={() => navigate("/")}
      >
        Home
      </button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Items Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 ">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b py-4 flex-col md:flex-row gap-8"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150?text=No+Image")
                      }
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2 ">
                        {/* Decrement Quantity */}
                        <button
                          onClick={() => dispatch(removeItem(item._id))}
                          className="bg-gray-200 p-2 rounded cursor-pointer"
                        >
                          <FaMinus />
                        </button>
                        <span className="mx-4">{item.quantity}</span>
                        {/* Increment Quantity */}
                        <button
                          onClick={() => dispatch(addItem(item))}
                          className="bg-gray-200 p-2 rounded cursor-pointer"
                        >
                          <FaPlus />
                        </button>
                        {/* Remove Item */}
                        <button
                          onClick={() => dispatch(deleteItem(item._id))}
                          className="ml-4 text-red-500 cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
                {/* Clear Cart Button */}
                <button
                  onClick={() => dispatch(clearCart())}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Checkout Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>

            <CheckoutPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
