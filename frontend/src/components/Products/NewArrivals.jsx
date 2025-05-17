import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const newArrivals = [
  {
    _id: "1",
    name: "Stylish Jocket",
    price: 120,
    image: [
      {
        url: "https://picsum.photos/200?random=1",
        altText: "Stylish Jocket",
      },
    ],
  },
  {
    _id: "2",
    name: "Stylish Jocket",
    price: 120,
    image: [
      {
        url: "https://picsum.photos/200?random=2",
        altText: "Stylish Jocket",
      },
    ],
  },
  {
    _id: "3",
    name: "Stylish Jocket",
    price: 120,
    image: [
      {
        url: "https://picsum.photos/200?random=3",
        altText: "Stylish Jocket",
      },
    ],
  },
  {
    _id: "4",
    name: "Stylish Jocket",
    price: 120,
    image: [
      {
        url: "https://picsum.photos/200?random=4",
        altText: "Stylish Jocket",
      },
    ],
  },
  {
    _id: "5",
    name: "Stylish Jocket",
    price: 120,
    image: [
      {
        url: "https://picsum.photos/200?random=5",
        altText: "Stylish Jocket",
      },
    ],
  },
  {
    _id: "6",
    name: "Stylish Jocket",
    price: 120,
    image: [
      {
        url: "https://picsum.photos/200?random=6",
        altText: "Stylish Jocket",
      },
    ],
  },
  {
    _id: "7",
    name: "Stylish Jocket",
    price: 120,
    image: [
      {
        url: "https://picsum.photos/200?random=7",
        altText: "Stylish Jocket",
      },
    ],
  },
  {
    _id: "8",
    name: "Stylish Jocket",
    price: 120,
    image: [
      {
        url: "https://picsum.photos/200?random=8",
        altText: "Stylish Jocket",
      },
    ],
  },
];

function NewArrivals() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Scroll function
  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Update scroll button states
  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons(); // Initialize button states
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, []);

  // Drag-to-scroll functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-2 px-2 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-10">
          Discover the latest style straight off the runway, freshly added to
          keep on the cutting edge of fashion.
        </p>
        {/* Scroll buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border bg-white text-black ${
              !canScrollLeft ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border bg-white text-black ${
              !canScrollRight ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="container mx-auto overflow-x-scroll whitespace-nowrap scroll-smooth"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="inline-flex space-x-6">
          {newArrivals.map((product) => (
            <div
              key={product._id}
              className="min-w-[200px] sm:min-w-[250px] lg:min-w-[300px] relative inline-block"
            >
              <img
                src={product.image[0]?.url}
                alt={product.image[0]?.altText || product.name}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                <Link to={`/product/${product._id}`} className="block">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="mt-1">${product.price}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
