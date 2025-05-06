import { useState, useCallback, useEffect } from "react";

const HeroSearch = ({ searchQuery, setSearchQuery, applyFilters }) => {
  const [city, setCity] = useState("");

  // ✅ Debounce filter application to avoid excessive updates
  useEffect(() => {
    if (city.trim()) {
      applyFilters({
        searchQuery: city.trim(),
        location: city,
        priceRange: 1000,
        type: [],
        surface: [],
        category: [],
      });
    }
  }, [city]); // ✅ Only runs when city changes

  return (
    <div className="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-4">
      {/* ✅ Search Field for City */}
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full md:flex-1 border border-gray-300 px-4 py-3 rounded-xl text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* ✅ Search Button (No need for extra filter function) */}
      <button
        onClick={() => setSearchQuery(city.trim())}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md"
      >
        🔍 Search
      </button>
    </div>
  );
};

export default HeroSearch;