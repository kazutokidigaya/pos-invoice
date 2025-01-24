import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ItemPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'update'
  const [currentItem, setCurrentItem] = useState(null); // For editing an item
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const itemsPerPage = 10;

  const getAllItems = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/items/get-item"
      );
      setItemsData(data);
    } catch (error) {
      console.log("Error In getting Items:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAllItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (modalMode === "add") {
      // Add item

      try {
        await axios.post("http://localhost:5000/api/items/add-item", formData);
        toast.success("Item added successfully!");
      } catch (error) {
        console.error("Error adding item:", error);
        toast.error("Error adding item");
      }
    } else if (modalMode === "update") {
      // Update item
      try {
        await axios.put(
          `http://localhost:5000/api/items/update-item/${currentItem._id}`,
          formData
        );
        toast.success("Item updated successfully!");
      } catch (error) {
        console.error("Error updating item:", error);
        toast.error("Error updating item");
      }
    }

    setIsModalOpen(false);
    setFormData({ name: "", price: "", category: "", image: "" });
    setCurrentItem(null);

    // Refresh the items list
    getAllItems();
  };

  const handleEdit = (item) => {
    setModalMode("update");
    setCurrentItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
    });
    toggleModal();
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/items/delete-item/${id}`);
      getAllItems();
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleteing item:", error);
      toast.error("Error deleteing item");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination
  const totalPages = Math.ceil(itemsData.length / itemsPerPage);
  const currentItems = itemsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="w-full flex items-center justify-center p-10 align-middle h-screen">
          <div
            disabled
            type="button"
            className="py-6 px-12 me-2 text-xl font-medium text-gray-900 bg-white rounded-lg border-2  hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 inline-flex items-center border-blue-500"
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
            Loading Resources...
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setModalMode("add");
                setCurrentItem(null);
                setFormData({ name: "", price: "", category: "", image: "" });
                toggleModal();
              }}
              className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
            >
              Add Item
            </button>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div
              id="crud-modal"
              className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm ">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 ">
                      {modalMode === "add" ? "Add New Product" : "Edit Product"}
                    </h3>
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-10 h-8 ms-auto inline-flex justify-center items-center "
                    >
                      x
                    </button>
                  </div>
                  <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                          placeholder="Type product name"
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="price"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          placeholder="Price"
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="category"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        >
                          <option value="">Select category</option>
                          <option value="drinks">Drinks</option>
                          <option value="rice">Rice</option>
                          <option value="noodles">Noodles</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="image"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          Image URL
                        </label>
                        <input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          placeholder="Image URL"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                      {modalMode === "add" ? "+ Add Product" : "Update Product"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-[700px]">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-16 py-3">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                    key={item._id}
                  >
                    <td className="p-4">
                      <img
                        src={item.image}
                        className="w-16 md:w-32 max-w-full max-h-full"
                        alt={item.name || "Product Image"}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="font-medium text-blue-600  hover:underline"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="font-medium text-red-600  hover:underline"
                        >
                          Remove
                        </button>
                      </div>
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
        </>
      )}
    </div>
  );
};

export default ItemPage;
