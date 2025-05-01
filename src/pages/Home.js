import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import FieldCard from "../components/FieldCard";
import Filters from "../components/Filters"; // ✅ Import Filters

const Home = () => {
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "soccerFields"));
        const fieldList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          images: doc.data().images || [],
          location: doc.data().location || "No location prov", // ✅ Ensure location is retrieved
        }));
        setFields(fieldList);
        setFilteredFields(fieldList);
      } catch (err) {
        console.error("Error fetching fields:", err);
        setError("Failed to load fields. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // ✅ Handle Scroll Detection in `Home.js`
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Updated Filtering to Include Location
  const applyFilters = ({ location, priceRange, type, surface, category }) => {
    const results = fields.filter(field =>
      (!location || field.location?.toLowerCase().includes(location.toLowerCase())) && // ✅ Location Filter
      (!priceRange || field.price_per_hour <= priceRange) &&
      (!type.length || type.includes(field.type)) &&
      (!surface.length || surface.includes(field.surface)) &&
      (!category.length || category.includes(field.category))
    );
    setFilteredFields(results);
  };

  const clearFilters = () => {
    setFilteredFields(fields); // ✅ Reset filtered fields to full list
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row">
      
      {/* ✅ Smooth Scrolling Sidebar Filters */}
      <div
        className="fixed left-5 transition-transform duration-500 ease-in-out bg-gray-100 p-4 rounded-md shadow-md hidden md:block"
        style={{
          transform: `translateY(${scrollPosition > 100 ? "30px" : "20px"})`,
        }}
      >
        <Filters applyFilters={applyFilters} clearFilters={clearFilters} />
      </div>

      {/* Field Listings */}
      <div className="lg:w-2/3 ml-64 grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading fields...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : filteredFields.length > 0 ? (
          filteredFields.map(field => (
            <FieldCard key={field.id} field={field} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No fields match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default Home;