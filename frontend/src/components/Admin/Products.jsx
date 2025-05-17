import React, { useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from "react-icons/fi";

const Products = () => {
  // Initial product data
  const initialProducts = [
    {
      id: 1,
      name: "Product 1",
      category: "Electronics",
      price: 99.99,
      stock: 45,
      size: "M",
      color: "Red",
      brand: "Brand A",
      material: "Cotton",
      images: [
        { url: "https://picsum.photos/200?random=1", altText: "Product 1" },
      ],
    },
    {
      id: 2,
      name: "Product 2",
      category: "Clothing",
      price: 29.99,
      stock: 120,
      size: "L",
      color: "Blue",
      brand: "Brand B",
      material: "Polyester",
      images: [
        { url: "https://picsum.photos/200?random=2", altText: "Product 2" },
      ],
    },
    {
      id: 3,
      name: "Product 3",
      category: "Home",
      price: 149.99,
      stock: 23,
      size: "S",
      color: "Green",
      brand: "Brand C",
      material: "Wool",
      images: [
        { url: "https://picsum.photos/200?random=3", altText: "Product 3" },
      ],
    },
    {
      id: 4,
      name: "Product 4",
      category: "Electronics",
      price: 199.99,
      stock: 67,
      size: "XL",
      color: "Black",
      brand: "Brand D",
      material: "Leather",
      images: [
        { url: "https://picsum.photos/200?random=4", altText: "Product 4" },
      ],
    },
    {
      id: 5,
      name: "Product 5",
      category: "Books",
      price: 14.99,
      stock: 89,
      size: "XL",
      color: "Blue",
      brand: "Brand E",
      material: "Paper",
      images: [
        { url: "https://picsum.photos/200?random=5", altText: "Product 5" },
      ],
    },
  ];

  // State management
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!currentProduct?.name) newErrors.name = "Name is required";
    if (!currentProduct?.category) newErrors.category = "Category is required";
    if (!currentProduct?.price || currentProduct.price <= 0)
      newErrors.price = "Valid price is required";
    if (!currentProduct?.stock || currentProduct.stock < 0)
      newErrors.stock = "Valid stock quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle saving product (both add and edit)
  const handleSave = () => {
    console.log("Saving product:", currentProduct);
    // Validate form before saving
    if (!validateForm()) return;

    if (currentProduct.id) {
      // Update existing product
      setProducts(
        products.map((p) => (p.id === currentProduct.id ? currentProduct : p))
      );
    } else {
      // Add new product
      setProducts([
        ...products,
        {
          ...currentProduct,
          id: Math.max(...products.map((p) => p.id), 0) + 1,
        },
      ]);
    }
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    }));
  };

  // Handle editing a product
  const handleEdit = (product) => {
    setCurrentProduct({ ...product });
    setIsModalOpen(true);
    setErrors({});
  };

  // Handle deleting a product
  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    setDeleteConfirm(null);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImage = {
        url: URL.createObjectURL(file),
        altText: file.name,
      };

      setCurrentProduct((prev) => ({
        ...(prev || {
          id: 0,
          name: "",
          category: "",
          price: 0,
          stock: 0,
          size: "",
          color: "",
          brand: "",
          material: "",
        }),
        images: [newImage],
      }));
    }
  };

  // Reset form when closing modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setErrors({});
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with search and add button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setCurrentProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            <FiPlus className="mr-2" /> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].altText}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentProduct?.id ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {currentProduct?.images?.[0]?.url ? (
                        <img
                          src={currentProduct.images[0].url}
                          alt={
                            currentProduct.images[0].altText || "Product image"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <span className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Select Image
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG or GIF (max. 2MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct?.name || ""}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={currentProduct?.category || ""}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2`}
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Books">Books</option>
                  <option value="Toys">Toys</option>
                  <option value="Sports">Sports</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price *
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={currentProduct?.price || ""}
                      onChange={handleInputChange}
                      className={`block w-full pl-8 border ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm p-2`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={currentProduct?.stock || ""}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${
                      errors.stock ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm p-2`}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Size and Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <select
                    name="size"
                    value={currentProduct?.size || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select a size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <select
                    name="color"
                    value={currentProduct?.color || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select a color</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Pink">Pink</option>
                    <option value="Purple">Purple</option>
                  </select>
                </div>
              </div>

              {/* Brand and Material */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <select
                    name="brand"
                    value={currentProduct?.brand || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select a brand</option>
                    <option value="Brand A">Brand A</option>
                    <option value="Brand B">Brand B</option>
                    <option value="Brand C">Brand C</option>
                    <option value="Brand D">Brand D</option>
                    <option value="Brand E">Brand E</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Material
                  </label>
                  <select
                    name="material"
                    value={currentProduct?.material || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select a material</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Polyester">Polyester</option>
                    <option value="Wool">Wool</option>
                    <option value="Leather">Leather</option>
                    <option value="Silk">Silk</option>
                    <option value="Denim">Denim</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this product? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;