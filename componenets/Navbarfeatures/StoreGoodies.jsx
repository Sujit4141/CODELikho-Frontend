import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axiosClient from "../../src/utils/axiosClient";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX,FiImage } from "react-icons/fi";

function StoreGoodies() {
  const [loading, setLoading] = useState(true);
  const [goodies, setGoodies] = useState([]);
  const [filteredGoodies, setFilteredGoodies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoodie, setCurrentGoodie] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [goodieToDelete, setGoodieToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredGoodies(goodies);
    } else {
      const filtered = goodies.filter((goodie) =>
        goodie.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGoodies(filtered);
    }
  }, [searchTerm, goodies]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/goodies/getallgoodies");
      setGoodies(response.data);
      setFilteredGoodies(response.data);
    } catch (err) {
      console.error("Error fetching goodies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (goodie) => {
    setCurrentGoodie(goodie);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (goodie) => {
    setGoodieToDelete(goodie);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!goodieToDelete) return;
    
    try {
      setLoading(true);
      await axiosClient.delete(`/goodies/deletegoodies/${goodieToDelete._id}`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error deleting goodie:", err);
    } finally {
      setIsDeleteConfirmOpen(false);
      setGoodieToDelete(null);
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentGoodie) return;
    
    try {
      setLoading(true);
      if (currentGoodie._id) {
        // Update existing goodie
       
          const dataToSend = {
     ...currentGoodie,
     productPrice: Number(currentGoodie.productPrice),
     quantity: Number(currentGoodie.quantity)};
        await axiosClient.put(
          `/goodies/updategoodies/${currentGoodie._id}`,
          dataToSend
          
        );
      } else {
       
        // Create new goodie
            const dataToSend = {
     ...currentGoodie,
     productPrice: Number(currentGoodie.productPrice),
     quantity: Number(currentGoodie.quantity)};
      console.log(dataToSend)

        await axiosClient.post("/goodies/addgoodies", dataToSend);
      }
      fetchData(); // Refresh data
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving goodie:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentGoodie({
      productName: "",
      productDescription: "",
      productPrice: 0,
      quantity: 0,
     productImage: " "
    });
  
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentGoodie({
      ...currentGoodie,
      [name]: value
    });
  };

   return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Store Management</h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Effortlessly manage your store inventory and merchandise
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Product Inventory</h2>
            <p className="text-gray-400 mt-1">
              {filteredGoodies.length} products available
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="join">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input input-bordered join-item w-full bg-gray-800 border-gray-700 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="btn join-item bg-gray-700 border-gray-700 hover:bg-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <FiSearch className="text-lg" />
                </button>
              </div>
            </div>
            
            <button
              onClick={handleAddNew}
              className="btn btn-primary gap-2"
            >
              <FiPlus className="text-lg" />
              Add Product
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div>
            {filteredGoodies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoodies.map((item) => (
                  <div 
                    key={item._id} 
                    className="card bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <figure className="h-56 bg-gray-900 relative">
                      {item.productImage ? (
                        <img 
                          src={item.productImage} 
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                          <FiImage className="text-5xl mb-2" />
                          <span>No image available</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-70 px-2 py-1 rounded-lg text-xs">
                        ID: {item._id.slice(-6)}
                      </div>
                    </figure>
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <h2 className="card-title text-white">
                          {item.productName}
                        </h2>
                        <div className="text-xl font-bold text-purple-400">
                          ₹{item.productPrice.toFixed(2)}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mt-2 line-clamp-2">
                        {item.productDescription}
                      </p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className={`badge ${item.quantity > 20 
                          ? "badge-success" 
                          : item.quantity > 5 
                            ? "badge-warning"
                            : "badge-error"
                        }`}>
                          {item.quantity} in stock
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="btn btn-ghost btn-circle btn-sm text-blue-400 hover:bg-blue-900 hover:text-blue-300"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="btn btn-ghost btn-circle btn-sm text-red-400 hover:bg-red-900 hover:text-red-300"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card bg-gray-800 border border-gray-700">
                <div className="card-body items-center text-center py-16">
                  <div className="text-6xl text-gray-600 mb-4">📦</div>
                  <h2 className="card-title text-gray-300">No products found</h2>
                  <p className="mb-4 text-gray-500">Try adjusting your search or add a new product</p>
                  <div className="flex gap-3">
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="btn btn-ghost text-purple-400"
                      >
                        Clear search
                      </button>
                    )}
                    <button
                      onClick={handleAddNew}
                      className="btn btn-primary"
                    >
                      <FiPlus className="mr-2" />
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Edit/Create Modal */}
      {isModalOpen && currentGoodie && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl bg-gray-800 text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-white">
                {currentGoodie._id ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-300">Product Name</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={currentGoodie.productName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-300">Description</span>
                  </label>
                  <textarea
                    name="productDescription"
                    value={currentGoodie.productDescription}
                    onChange={handleInputChange}
                    rows="3"
                    className="textarea textarea-bordered w-full bg-gray-700 border-gray-600 text-white"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text text-gray-300">Price (₹)</span>
                  </label>
                  <input
                    type="number"
                    name="productPrice"
                    value={currentGoodie.productPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text text-gray-300">Quantity</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={currentGoodie.quantity}
                    onChange={handleInputChange}
                    min="0"
                    className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-300">Image URL</span>
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={currentGoodie.imageUrl || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="modal-action mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {currentGoodie._id ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && goodieToDelete && (
        <div className="modal modal-open">
          <div className="modal-box bg-gray-800 text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-white">Confirm Deletion</h3>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="py-4 text-gray-300">
                Are you sure you want to delete <span className="font-bold text-white">{goodieToDelete.productName}</span>? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="modal-action">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn btn-ghost text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-error"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoreGoodies;