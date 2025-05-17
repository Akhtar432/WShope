import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

function SortOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "");

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    // Update the URL with the selected sort option
    if (selectedOption) {
      searchParams.set("sort", selectedOption);
    } else {
      searchParams.delete("sort");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="short"
        className="border p-2 rounded focus:outline-none"
        value={sortOption}
        onChange={handleSortChange}
      >
        <option value="">Default</option>
        <option value="priceAcs">Price: Low to High</option>
        <option value="PriceDesc">Price: High to Low</option>
        <option value="Popularity">Popularity</option>
      </select>
    </div>
  );
}

export default SortOptions;