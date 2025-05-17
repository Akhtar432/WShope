import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from './SortOptions';
import ProductGrid from '../components/Products/ProductGrid';

function Collection() {
  const [products, setProducts] = useState([]);
  const sidearRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    // Close sidebar if clicked outside.
    if (sidearRef.current && !sidearRef.current.contains(e.target));
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    // Add Event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    // Clean event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const fetchProducts = [
        {
          _id: 5,
          name: 'Stylish Jeans',
          price: 130,
          images: [
            {
              url: 'https://picsum.photos/200?random=5',
              altText: 'Stylish Jeans',
            },
          ],
        },
        {
          _id: 6,
          name: 'Casual T-Shirt',
          price: 25,
          images: [
            {
              url: 'https://picsum.photos/200?random=6',
              altText: 'Casual T-Shirt',
            },
          ],
        },
        {
          _id: 7,
          name: 'Casual T-Shirt',
          price: 25,
          images: [
            {
              url: 'https://picsum.photos/200?random=7',
              altText: 'Casual T-Shirt',
            },
          ],
        },
        {
          _id: 8,
          name: 'Casual T-Shirt',
          price: 25,
          images: [
            {
              url: 'https://picsum.photos/200?random=8',
              altText: 'Casual T-Shirt',
            },
          ],
        },
      ];
      setProducts(fetchProducts);
    }, 1000);
  }, []);

  return (
    <div className='flex flex-col lg:flex-row'>
      {/* Mobile Filter button */}
      <button onClick={toggleSidebar} className='lg:hidden border p-2 flex justify-center items-center'>
        <FaFilter className='mr-2' /> Filters
      </button>
      {/* Filter sidebar */}
      <div ref={sidearRef} className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>

        <FilterSidebar />
      </div>
      <div className='flex-grow p-4'>
        <h2 className='text-2xl uppercase mv-4'>All Collection</h2>

        {/* sort options */}
        <SortOptions/>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default Collection;