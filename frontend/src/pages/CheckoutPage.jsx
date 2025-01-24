import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    paymentMode: "",
    grandTotal: 0, // Initialize with 0
    cartItems: [], // Include cart items in form data
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get cart items and calculate grand total
  const cartItems = useSelector((state) => state.cart.items);
  const grandTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Update grandTotal and cartItems in formData whenever cart changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      grandTotal: grandTotal,
      cartItems: cartItems, // Add cart items
    }));
  }, [grandTotal, cartItems]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid phone number is required";
    }
    if (!formData.paymentMode) {
      newErrors.paymentMode = "Please select a payment mode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentModeSelect = (mode) => {
    setFormData((prev) => ({
      ...prev,
      paymentMode: mode,
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix validation errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://pos-invoice.onrender.com/api/bills/add-bills",
        formData
      );

      if (res.status === 201) {
        toast.success("Checkout details submitted successfully!");
        dispatch(clearCart());
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          paymentMode: "",
          grandTotal: 0,
          cartItems: [],
        });
        navigate("/bills");
      }
    } catch (error) {
      console.error("Error submitting checkout details:", error);
      toast.error(
        "An error occurred while submitting the form. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      {loading ? (
        <div className="w-full flex items-center justify-center p-10 align-middle h-screen">
          <div
            disabled
            type="button"
            className="py-6 px-12 me-2 text-xl font-medium text-gray-900 bg-white rounded-lg border-2  hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700  inline-flex items-center border-blue-500"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-6 h-6 me-3 text-gray-200 animate-spin "
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            Invoice Generating...
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
            <FaUser className="mr-2" /> Contact Information
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 rounded-lg border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 rounded-lg border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`mt-1 block w-full p-3 rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Mode of Payment
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full text-left mt-1 block p-3 rounded-lg border ${
                    errors.paymentMode ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                >
                  {formData.paymentMode || "Select Payment Mode"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 bg-white border mt-2 rounded-lg shadow-lg w-full">
                    <ul>
                      <li
                        onClick={() => handlePaymentModeSelect("Card")}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        Card
                      </li>
                      <li
                        onClick={() => handlePaymentModeSelect("Cash")}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        Cash
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {errors.paymentMode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentMode}
                </p>
              )}
            </div>

            {/* Grand Total */}
            <div>
              <label className="block text-base font-medium text-gray-700">
                Grand Total
              </label>
              <div className="mt-1 block w-full p-3 rounded-lg border border-gray-300 shadow-sm bg-gray-100">
                ${formData.grandTotal.toFixed(2)}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue to Payment
              </button>
              <button
                type="button"
                className="w-full mt-4 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() =>
                  setFormData({
                    firstName: "",
                    lastName: "",
                    phone: "",
                    paymentMode: "",
                    grandTotal: 0,
                    cartItems: [],
                  })
                }
              >
                Cancel Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
