import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

const BillsPage = () => {
  const [billsData, setBillsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const modalRef = useRef();

  const billsPerPage = 10;

  const getAllBills = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://pos-invoice.onrender.com/api/bills/get-bills"
      );
      setBillsData(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Error Loading Invoice Details!");
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
  };

  const handlePrint = useReactToPrint({
    content: () => modalRef.current,
  });

  const totalPages = Math.ceil(billsData.length / billsPerPage);
  const currentBills = billsData.slice(
    (currentPage - 1) * billsPerPage,
    currentPage * billsPerPage
  );

  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="w-full flex items-center justify-center p-10 align-middle h-screen">
          <div className="py-6 px-12 text-xl font-medium text-gray-900 bg-white rounded-lg border-2">
            Loading Bills...
          </div>
        </div>
      ) : (
        <div>
          {/* Bills Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-[700px]">
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Bill ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    First Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment Mode
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Grand Total
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBills.map((bill) => (
                  <tr
                    className="bg-white border-b border-b-gray-200 hover:bg-gray-50 "
                    key={bill._id}
                  >
                    <td className="px-6 py-4">{bill._id}</td>
                    <td className="px-6 py-4">{bill.firstName}</td>
                    <td className="px-6 py-4">{bill.lastName}</td>
                    <td className="px-6 py-4">{bill.paymentMode}</td>
                    <td className="px-6 py-4">${bill.grandTotal.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => openModal(bill)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <nav className="inline-flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-5 flex-col">
          <div
            className="bg-white rounded-lg shadow-lg w-96 p-6"
            ref={modalRef}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
              <p>
                Customer Name:{" "}
                <strong>
                  {selectedBill.firstName} {selectedBill.lastName}
                </strong>
              </p>
              <p>Phone: {selectedBill.phone}</p>
              <p>
                Date: {new Date(selectedBill.createdAt).toLocaleDateString()}
              </p>
              <table className="w-full mt-4 border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1">Item</th>
                    <th className="border border-gray-300 px-2 py-1">Qty</th>
                    <th className="border border-gray-300 px-2 py-1">Price</th>
                    <th className="border border-gray-300 px-2 py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.cartItems.map((item) => (
                    <tr key={item._id}>
                      <td className="border border-gray-300 px-2 py-1">
                        {item.name}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 font-bold">
                Grand Total: ${selectedBill.grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Download Invoice
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillsPage;
