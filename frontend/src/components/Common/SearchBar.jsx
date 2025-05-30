import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    console.log("Search Term: ", searchTerm);
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSubmitForm}
          className="relative flex items-center justify-center w-full "
        >
          <div className="relative w-2/3">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            {/* Search Icon */}
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
            {/* Close Button */}
            <button
              type="button"
              onClick={handleSearchToggle}
              aria-label="Close search"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <HiMiniXMark className="h-6 w-6" />
            </button>
          </div>
        </form>
      ) : (
        <button onClick={handleSearchToggle} aria-label="Open search">
          <HiMagnifyingGlass className="h-6 w-6 pt-1" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
