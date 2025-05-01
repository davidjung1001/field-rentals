import { useState } from "react";

const Filters = ({ applyFilters, clearFilters }) => {
  const [location, setLocation] = useState(""); // ✅ Location Filter Added
  const [priceRange, setPriceRange] = useState(50);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (setFilter, value) => {
    setFilter(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    applyFilters({ location, priceRange, type: selectedTypes, surface: selectedSurfaces, category: selectedCategories });
  };

  const handleClearFilters = () => {
    setLocation(""); // ✅ Reset Location
    setPriceRange(50);
    setSelectedTypes([]);
    setSelectedSurfaces([]);
    setSelectedCategories([]);
    clearFilters(); // ✅ Reset Filters in `Home.js`
  };

  return (
    <div className="w-64 bg-gray-100 p-4 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Refine Results</h2>

      {/* ✅ Location Filter */}
      <label className="block font-semibold mb-2">Location</label>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      {/* Price Range Filter */}
      <label className="block mb-2">Max Price: ${priceRange}</label>
      <input
        type="range"
        min="10"
        max="200"
        value={priceRange}
        onChange={(e) => setPriceRange(Number(e.target.value))}
        className="w-full"
      />

      {/* Type Filter */}
      <label className="block font-semibold mb-2">Type</label>
      <div>
        {["indoor", "outdoor"].map(type => (
          <div key={type} className="mb-1">
            <input type="checkbox" id={type} checked={selectedTypes.includes(type)} onChange={() => handleCheckboxChange(setSelectedTypes, type)} />
            <label htmlFor={type} className="ml-2">{type}</label>
          </div>
        ))}
      </div>

      {/* Surface Filter */}
      <label className="block font-semibold mt-2 mb-2">Surface</label>
      <div>
        {["grass", "turf"].map(surface => (
          <div key={surface} className="mb-1">
            <input type="checkbox" id={surface} checked={selectedSurfaces.includes(surface)} onChange={() => handleCheckboxChange(setSelectedSurfaces, surface)} />
            <label htmlFor={surface} className="ml-2">{surface}</label>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <label className="block font-semibold mt-2 mb-2">Category</label>
      <div>
        {["11v11", "9v9", "7v7", "5v5"].map(category => (
          <div key={category} className="mb-1">
            <input type="checkbox" id={category} checked={selectedCategories.includes(category)} onChange={() => handleCheckboxChange(setSelectedCategories, category)} />
            <label htmlFor={category} className="ml-2">{category}</label>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex space-x-2 mt-4">
        <button onClick={handleApplyFilters} className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Apply</button>
        <button onClick={handleClearFilters} className="w-1/2 bg-red-500 text-white p-2 rounded hover:bg-red-600">Clear</button>
      </div>
    </div>
  );
};

export default Filters;