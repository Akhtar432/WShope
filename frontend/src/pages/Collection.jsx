import React, { useEffect, useRef, useState, useMemo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from './SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { fetchProductsByFilters } from '../redux/slices/productSlice';

function Collection() {
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { Collection } = useParams();
  const [searchParam] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // ✅ Memoize query params so object reference doesn't change each render
  const queryParam = useMemo(() => Object.fromEntries([...searchParam]), [searchParam]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection: Collection, ...queryParam }));
  }, [dispatch, Collection, queryParam]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      {/* Filter sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>

        {/* Sort options */}
        <SortOptions />

        {/* Product Grid */}
        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default Collection;
