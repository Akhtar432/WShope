import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";

const selectedProduct = {
  name: "Stylish Jeans",
  price: 130,
  originalPrice: 160,
  description: "This stylish jeans perfect for any occasion",
  brand: "FashionBrand",
  material: "Cotton",
  sizes: ["S", "M", "L", "XL"],
  color: ["Red", "Black"],
  image: [
    {
      url: "https://picsum.photos/200?random=1",
      altText: "Stylish Jeans 1",
    },
    {
      url: "https://picsum.photos/200?random=2",
      altText: "Stylish Jeans 2",
    },
  ],
};

const similarProduct = [
  {
    _id: 1,
    name: "Stylish Jeans",
    price: 130,
    images: [
      {
        url: "https://picsum.photos/200?random=1",
        altText: "Stylish Jeans",
      },
    ],
  },
  {
    _id: 2,
    name: "Casual T-Shirt",
    price: 25,
    images: [
      {
        url: "https://picsum.photos/200?random=2",
        altText: "Casual T-Shirt",
      },
    ],
  },
  {
    _id: 3,
    name: "Casual T-Shirt",
    price: 25,
    images: [
      {
        url: "https://picsum.photos/200?random=3",
        altText: "Casual T-Shirt",
      },
    ],
  },
  {
    _id: 4,
    name: "Casual T-Shirt",
    price: 25,
    images: [
      {
        url: "https://picsum.photos/200?random=4",
        altText: "Casual T-Shirt",
      },
    ],
  },
];

function ProductDetails() {
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Set the main image on component mount
  useEffect(() => {
    if (selectedProduct?.image?.length > 0) {
      setMainImage(selectedProduct.image[0].url);
    }
  }, []);

  // Handle quantity changes
  const handleQuantityChanges = (action) => {
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a size and color before adding to cart!", {
        duration: 1000,
      });
      return;
    }

    setIsButtonDisabled(true);

    setTimeout(() => {
      toast.success("Product added to cart!", { duration: 1000 });

      setIsButtonDisabled(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.image.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <img
                src={mainImage}
                alt={selectedProduct.image[0]?.altText || "Main Product"}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Mobile Thumbnail */}
          <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
            {selectedProduct.image.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              {selectedProduct.name}
            </h1>
            {selectedProduct.originalPrice && (
              <p className="text-xl text-gray-600 mb-1 line-through">
                ${selectedProduct.originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-xl text-gray-500 mb-2">
              ${selectedProduct.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.color.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color
                        ? "border-4 border-black"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: "brightness(0.5)",
                    }}
                    aria-label={`Select color ${color}`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${
                      selectedSize === size ? "bg-black text-white" : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChanges("minus")}
                  className="px-2 py-2 bg-gray-200 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChanges("plus")}
                  className="px-2 py-2 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white font-semibold py-2 px-6 rounded w-full mb-4 uppercase ${
                isButtonDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "Add To Cart"}
            </button>

            {/* Product Characteristics */}
            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1">Brand</td>
                    <td className="py-1">{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Material</td>
                    <td className="py-1">{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">
            You May Also Like
          </h2>
          <ProductGrid products={similarProduct} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
