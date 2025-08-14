import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturedSection from "../components/Products/FeaturedSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

function Home() {
  const dispatch = useDispatch();
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);


  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    ).catch((err) => {
      console.error("Failed to fetch products:", err);
    });

    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        setBestSellerLoading(true);
        const response = await fetch(
          "http://localhost:9000/api/products/best-seller"
        );
        if (!response.ok) throw new Error("Failed to fetch best seller");
        const data = await response.json();
        setBestSellerProduct(data.bestSeller);
      } catch (error) {
        console.error("Error fetching best seller:", error);
      } finally {
        setBestSellerLoading(false);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller */}
      <section className="my-10">
        <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
        {bestSellerLoading ? (
          <p className="text-center">Loading best seller...</p>
        ) : bestSellerProduct ? (
          <ProductDetails productId={bestSellerProduct._id} />
        ) : (
          <p className="text-center text-red-500">Failed to load best seller</p>
        )}
      </section>

      {/* Women's Top Wear */}
      <section className="container mx-auto my-10">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wear for Women
        </h2>
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
        />
      </section>

      <FeaturedCollection />
      <FeaturedSection />
    </div>
  );
}

export default Home;