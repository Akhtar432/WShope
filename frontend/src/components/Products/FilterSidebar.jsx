import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: [],
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const category = ["Top Wear", "Bottom Wear"];
  const colors = ["Red", "Blue", "Black", "Yellow", "Green", "Gray", "White", "Pink", "Beige", "Navy"];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Denim", "Polyester", "Silks", "Linen", "Viscose", "Fleece"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fashionista", "ChicStyle"];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color ? params.color.split(",") : [],
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number(params.minPrice) || 0,
      maxPrice: Number(params.maxPrice) || 100,
    });
    setPriceRange([Number(params.minPrice) || 0, Number(params.maxPrice) || 100]);
  }, [searchParams]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

      {/* Category Filter */}
      <label className="block text-gray-600 font-medium mb-2">Category</label>
      {category.map((cat) => (
        <div key={cat} className="flex items-center mb-1">
          <input
            type="radio"
            name="category"
            value={cat}
            checked={filters.category === cat}
            onChange={(e) => setSearchParams({ ...Object.fromEntries([...searchParams]), category: e.target.value })}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
          />
          <span className="text-gray-700">{cat}</span>
        </div>
      ))}

      {/* Gender Filter */}
      <label className="block text-gray-600 font-medium mb-2">Gender</label>
      {genders.map((gender) => (
        <div key={gender} className="flex items-center mb-1">
          <input
            type="radio"
            name="gender"
            value={gender}
            checked={filters.gender === gender}
            onChange={(e) => setSearchParams({ ...Object.fromEntries([...searchParams]), gender: e.target.value })}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
          />
          <span className="text-gray-700">{gender}</span>
        </div>
      ))}

      {/* Color Filter */}
      <label className="block text-gray-600 font-medium mb-2">Color</label>
      {colors.map((color) => (
        <div key={color} className="flex items-center mb-1">
          <input
            type="checkbox"
            value={color}
            checked={filters.color.includes(color)}
            onChange={() => {
              const newColors = filters.color.includes(color)
                ? filters.color.filter((c) => c !== color)
                : [...filters.color, color];
              setSearchParams({ ...Object.fromEntries([...searchParams]), color: newColors.join(",") });
            }}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
          />
          <span className="text-gray-700">{color}</span>
        </div>
      ))}

      {/* Size Filter */}
      <label className="block text-gray-600 font-medium mb-2">Size</label>
      {sizes.map((size) => (
        <div key={size} className="flex items-center mb-1">
          <input
            type="checkbox"
            value={size}
            checked={filters.size.includes(size)}
            onChange={() => {
              const newSizes = filters.size.includes(size)
                ? filters.size.filter((s) => s !== size)
                : [...filters.size, size];
              setSearchParams({ ...Object.fromEntries([...searchParams]), size: newSizes.join(",") });
            }}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
          />
          <span className="text-gray-700">{size}</span>
        </div>
      ))}

      {/* Material Filter */}
      <label className="block text-gray-600 font-medium mb-2">Material</label>
      {materials.map((material) => (
        <div key={material} className="flex items-center mb-1">
          <input
            type="checkbox"
            value={material}
            checked={filters.material.includes(material)}
            onChange={() => {
              const newMaterials = filters.material.includes(material)
                ? filters.material.filter((m) => m !== material)
                : [...filters.material, material];
              setSearchParams({ ...Object.fromEntries([...searchParams]), material: newMaterials.join(",") });
            }}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
          />
          <span className="text-gray-700">{material}</span>
        </div>
      ))}

      {/* Brand Filter */}
      <label className="block text-gray-600 font-medium mb-2">Brand</label>
      {brands.map((brand) => (
        <div key={brand} className="flex items-center mb-1">
          <input
            type="checkbox"
            value={brand}
            checked={filters.brand.includes(brand)}
            onChange={() => {
              const newBrands = filters.brand.includes(brand)
                ? filters.brand.filter((b) => b !== brand)
                : [...filters.brand, brand];
              setSearchParams({ ...Object.fromEntries([...searchParams]), brand: newBrands.join(",") });
            }}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
          />
          <span className="text-gray-700">{brand}</span>
        </div>
      ))}

      {/* Price Filter */}
      <label className="block text-gray-600 font-medium mb-2">Price Range</label>
      <input
        type="range"
        min="0"
        max="100"
        value={priceRange[1]}
        onChange={(e) => {
          setPriceRange([0, Number(e.target.value)]);
          setSearchParams({ ...Object.fromEntries([...searchParams]), maxPrice: e.target.value });
        }}
        className="w-full"
      />
      <div className="text-gray-700 flex justify-between">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </div>
  );
}

export default FilterSidebar;