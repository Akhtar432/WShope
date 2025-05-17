import React from 'react';
import { Link } from 'react-router-dom';

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Product Image */}
            <div className="w-full h-64 mb-4 overflow-hidden rounded-lg">
              <img
                src={product.images[0]?.url || "https://via.placeholder.com/200"} // Fallback image
                alt={product.images[0]?.altText || `Image of ${product.name}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductGrid;