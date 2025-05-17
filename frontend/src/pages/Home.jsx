import React from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturedSection from '../components/Products/FeaturedSection'


const placeholderProducts = [
  {
    _id: 5,
    name: "Stylish Jeans",
    price: 130,
    images: [
      {
        url: "https://picsum.photos/200?random=5",
        altText: "Stylish Jeans",
      },
    ],
  },
  {
    _id: 6,
    name: "Casual T-Shirt",
    price: 25,
    images: [
      {
        url: "https://picsum.photos/200?random=6",
        altText: "Casual T-Shirt",
      },
    ],
  },
  {
    _id: 7,
    name: "Casual T-Shirt",
    price: 25,
    images: [
      {
        url: "https://picsum.photos/200?random=7",
        altText: "Casual T-Shirt",
      },
    ],
  },
  {
    _id: 8,
    name: "Casual T-Shirt",
    price: 25,
    images: [
      {
        url: "https://picsum.photos/200?random=8",
        altText: "Casual T-Shirt",
      },
    ],
  },
]

function Home() {
  return (
    <div>
      <Hero/>
      <GenderCollectionSection/>
      <NewArrivals/>

      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4 mt-10'>Best Seller</h2>
      <ProductDetails/>
      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4'>Top Wear for Women</h2>
        <ProductGrid products={placeholderProducts} />
      </div>
      <FeaturedCollection/>
      <FeaturedSection/>
    </div>
  )
}

export default Home
