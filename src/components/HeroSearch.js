import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoFilter } from "react-icons/io5"; 
import Filters from "./Filters"; 

const HeroSearch = ({ searchQuery, setSearchQuery, applyFilters }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [fieldSize, setFieldSize] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // ✅ Detect Mobile

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleApplyFilters = () => {
    applyFilters({
      searchQuery: searchQuery.trim() || "",
      date: selectedDate,
      fieldSize: fieldSize || "",
      location: "", 
      priceRange: 50, 
      type: [],
      surface: [],
      category: []
    });

    setShowFilters(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-between bg-white bg-opacity-80 p-4 rounded-full shadow-lg backdrop-blur-md relative space-x-2">
      
      {/* ✅ Search Bar with Placeholder & Text Visibility */}
      <input
        type="text"
        placeholder="Enter location"
        className="flex-grow border border-gray-300 p-3 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ✅ Hide Filters on Mobile */}
      {!isMobile && (
        <>
          <DatePicker 
            selected={selectedDate} 
            onChange={(date) => setSelectedDate(date)}
            className="border border-gray-300 p-3 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholderText="Select date"
          />

          <select 
            className="border border-gray-300 p-3 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFieldSize(e.target.value)}
          >
            <option value="">Select field size</option>
            <option value="5v5">5v5</option>
            <option value="7v7">7v7</option>
            <option value="9v9">9v9</option>
            <option value="11v11">11v11</option>
          </select>

          <button 
            onClick={handleApplyFilters} 
            className="bg-blue-500 text-white px-5 py-3 rounded-full hover:bg-blue-600 text-sm font-semibold shadow-md transition-all"
          >
            🔍 Search
          </button>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-300 text-black px-4 py-3 rounded-full text-sm flex items-center hover:bg-gray-400 shadow-md transition-all"
          >
            <IoFilter size={20} />
          </button>

          {showFilters && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white p-4 rounded-lg shadow-lg">
              <Filters applyFilters={applyFilters} clearFilters={() => setShowFilters(false)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeroSearch;