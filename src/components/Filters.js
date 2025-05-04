import { useState } from "react";

const Filters = ({ applyFilters, clearFilters }) => {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState(50);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // ✅ Ensure filters always contain valid values
  const handleUpdateFilters = () => {
    const newFilters = {
      location,
      priceRange,
      type: selectedTypes.length ? selectedTypes : [], // ✅ Default to empty array
      surface: selectedSurfaces.length ? selectedSurfaces : [], // ✅ Default to empty array
      category: selectedCategories.length ? selectedCategories : [], // ✅ Default to empty array
    };

    console.log("🔎 Applied Filters:", newFilters);
    applyFilters(newFilters); // ✅ Apply updated filters immediately
  };

  return (
    <div className="w-full flex flex-wrap items-center gap-4 bg-gray-100 p-4 rounded-full shadow-md opacity-80 backdrop-blur-md">
      {/* ✅ Location Dropdown */}
      <select className="border p-2 rounded-lg" value={location} onChange={(e) => { setLocation(e.target.value); handleUpdateFilters(); }}>
        <option value="">All Locations</option>
        <option value="Dallas">Dallas</option>
        <option value="Houston">Houston</option>
      </select>

      {/* ✅ Price Range */}
      <label className="text-sm font-semibold">Max Price: ${priceRange}</label>
      <input type="range" min="10" max="200" value={priceRange} onChange={(e) => { setPriceRange(Number(e.target.value)); handleUpdateFilters(); }} className="w-24" />

      {/* ✅ Apply & Clear Buttons */}
      <button onClick={clearFilters} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Clear Filters</button>
    </div>
  );
};

export default Filters;