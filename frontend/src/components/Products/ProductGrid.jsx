import React from 'react';
import { Link } from 'react-router-dom';

function ProductGrid({ products = [], loading, error }) {
  // Ensure products is always an array
  const productList = Array.isArray(products) 
    ? products 
    : products?.products || products?.data || [];

  if (loading) return <p className="text-center text-gray-500 py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-4">Error: {error.message || error}</p>;

  if (productList.length === 0) {
    return <p className="text-center text-gray-500 py-4">No products found</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
      {productList.map((product, index) => (
        <div key={product._id || `product-${index}`} className="block">
          <Link to={`/product/${product._id}`} className="block">
            <div className="bg-white h-full p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.images?.[0]?.url || "/images/default-product.png"}
                  alt={product.images?.[0]?.altText || product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/default-product.png";
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="mt-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-gray-900">
                  ${product.price?.toFixed(2) || '0.00'}
                </p>
                {product.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                )} 
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
