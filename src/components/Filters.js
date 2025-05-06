import { useState } from "react";
import { FaFilter } from "react-icons/fa"; // ✅ Import filter icon

const Filters = ({ applyFilters, clearFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // ✅ Toggle Filters on Click
  const toggleFilters = () => setShowFilters(!showFilters);

  // ✅ Handle checkbox selection
  const toggleSelection = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // ✅ Apply filters only when selections exist
  const handleUpdateFilters = () => {
    applyFilters({
      location,
      priceRange,
      type: selectedTypes,
      surface: selectedSurfaces,
      category: selectedCategories,
    });
  };

  return (
    <div className="relative w-full flex justify-end">
      
      {/* ✅ Filter Icon (Click to Toggle) */}
      <button onClick={toggleFilters} className="text-black text-xl p-3">
        <FaFilter />
      </button>

      {/* ✅ Filters Dropdown (Overlays Category Cards, No Extra Box) */}
      {showFilters && (
        <div className="absolute top-full right-0 w-64 p-2 z-50 text-black bg-opacity-95">
          
          {/* ✅ Location Dropdown */}
          <select className="border p-2 rounded-lg w-full mb-2 text-black"
            value={location}
            onChange={(e) => { setLocation(e.target.value); handleUpdateFilters(); }}
          >
            <option value="">All Locations</option>
            <option value="Dallas">Dallas</option>
            <option value="Houston">Houston</option>
          </select>

          {/* ✅ Price Range */}
          <label className="text-black font-semibold">Max Price: ${priceRange}</label>
          <input type="range" min="10" max="200" value={priceRange}
            onChange={(e) => { setPriceRange(Number(e.target.value)); handleUpdateFilters(); }}
            className="w-full"
          />

          {/* ✅ Surface Type (Checkboxes) */}
          <div className="mt-2 text-black">
            <h3 className="font-semibold">Surface Type</h3>
            {["Grass", "Turf", "Indoor"].map((surface) => (
              <label key={surface} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedSurfaces.includes(surface)}
                  onChange={() => toggleSelection(selectedSurfaces, setSelectedSurfaces, surface)}
                />
                {surface}
              </label>
            ))}
          </div>

          {/* ✅ Category Type (Checkboxes) */}
          <div className="mt-2 text-black">
            <h3 className="font-semibold">Categories</h3>
            {["Futsal", "Full Field", "Small Sided"].map((category) => (
              <label key={category} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedCategories.includes(category)}
                  onChange={() => toggleSelection(selectedCategories, setSelectedCategories, category)}
                />
                {category}
              </label>
            ))}
          </div>

          {/* ✅ Apply & Clear Buttons */}
          <div className="flex justify-between mt-4">
            <button onClick={clearFilters} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
              Clear Filters
            </button>
            <button onClick={handleUpdateFilters} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Apply Filters
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default Filters;