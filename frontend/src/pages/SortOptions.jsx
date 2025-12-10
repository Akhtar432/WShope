import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

function SortOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "");

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    if (selectedOption) {
      searchParams.set("sortBy", selectedOption);
    } else {
      searchParams.delete("sortBy");
    }

    setSearchParams(searchParams);
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        className="border p-2 rounded focus:outline-none"
        value={sortOption}
        onChange={handleSortChange}
      >
        <option value="">Default</option>

        {/* Correct values according to backend */}
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
}

export default SortOptions;
