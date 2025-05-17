import React from "react";
import menCollectionImg from "../../assets/mens-collection.webp";
import womenCollectionImg from "../../assets/womens-collection.webp";
import { Link } from "react-router-dom";

function GenderCollectionSection() {
  return (
    <section className="py-12 px-2 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women collection */}
        <div className="relative flex-1">
          <img
            src={womenCollectionImg}
            alt="Women's Collection"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        {/* Men's collection */}
        <div className="relative flex-1">
          <img
            src={menCollectionImg}
            alt="Women's Collection"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GenderCollectionSection;
