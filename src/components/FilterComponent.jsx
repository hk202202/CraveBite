/* eslint-disable react/prop-types */
const FilterComponent = ({ onFilterChange }) => {
  return (
    <div className="flex items-center justify-center">
      <label className="mr-2 whitespace-nowrap">Sort By:</label>
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className=" p-[5px]"
      >
        <option value="default">Default</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
      </select>
    </div>
  );
};

export default FilterComponent;
