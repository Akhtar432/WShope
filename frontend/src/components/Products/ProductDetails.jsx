import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import { addToCart } from "../../redux/slices/cartSlice";
import { 
  fetchProductDetails, 
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";

function ProductDetails({ productId }) {

  const { id } = useParams();
  const dispatch = useDispatch();
  const { 
    selectedProduct, 
    loading, 
    error, 
    similarProducts = [] 
  } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
      
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
      // Set default selections
      if (selectedProduct.color?.length) {
        setSelectedColor(selectedProduct.color[0]);
      }
      if (selectedProduct.sizes?.length) {
        setSelectedSize(selectedProduct.sizes[0]);
      }
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "minus" && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
    if (action === "plus") {
      setQuantity(prev => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select size and color");
      return;
    }

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => toast.success("Added to cart!"))
      .catch(err => toast.error(err.message))
      .finally(() => setIsButtonDisabled(false));
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!selectedProduct) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Product Main Section */}
        <div className="md:flex">
          {/* Image Gallery */}
          <div className="md:w-1/2 p-6">
            <div className="sticky top-4">
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={mainImage}
                  alt={selectedProduct.name}
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto py-2">
                {selectedProduct.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`${selectedProduct.name} ${i + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                      mainImage === img.url ? "border-black" : "border-transparent"
                    }`}
                    onClick={() => setMainImage(img.url)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {selectedProduct.name}
            </h1>
            
            <div className="flex items-center mb-4">
              {typeof selectedProduct.originalPrice === "number" && (
                <span className="text-lg text-gray-500 line-through mr-2">
                  ${selectedProduct.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900">
                {typeof selectedProduct.price === "number" ? `$${selectedProduct.price.toFixed(2)}` : "N/A"}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.color?.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? "border-black" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes?.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? "bg-black text-white border-black" 
                        : "border-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-3 py-1 border rounded-l-md bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-t border-b text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-3 py-1 border rounded-r-md bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`w-full py-3 px-4 rounded-md font-medium ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "Add to Cart"}
            </button>

            {/* Product Metadata */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-medium mb-3">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Brand</p>
                  <p>{selectedProduct.brand || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Material</p>
                  <p>{selectedProduct.material || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p>{selectedProduct.category || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">SKU</p>
                  <p>{selectedProduct.sku || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
          <ProductGrid 
            products={similarProducts} 
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;