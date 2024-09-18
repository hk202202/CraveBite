/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const SearchComponent = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  let debounceTimer;

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      handleSearch();
    }, 200);
  };

  return (
    <div className="my-4 flex w-full items-center justify-center">
      <input
        type="text"
        placeholder="Search by restaurant name"
        value={searchTerm}
        onChange={handleChange}
        className="border p-2 rounded-md w-full md:w-1/2 lg:w-1/4"
      />
      <button
        onClick={handleSearch}
        className="ml-2 bg-orange-600 text-white p-2 rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchComponent;
