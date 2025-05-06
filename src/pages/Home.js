import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySelection"; // ✅ New
import Navbar from "../components/Navbar";
import FieldCard from "../components/FieldCard";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Home = () => {
  const [fields, setFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ location: "", priceRange: 1000, type: [], surface: [], category: [] });

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "soccerFields"));
        const fieldList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFields(fieldList);
      } catch (err) {
        console.error("Error fetching fields:", err);
      }
    };

    fetchFields();
  }, []);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      

      {/* ✅ Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        applyFilters={setFilters}
      />

      {/* ✅ Category Section */}
      <CategorySection applyFilters={setFilters} />

      {/* ✅ Listings Section */}
      <div id="listings-section" className="relative z-10 px-4 md:px-10 mt-10">
        <div className="bg-gray-100 p-6 md:p-10 rounded-3xl shadow-xl max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Available Fields</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {fields.length > 0 ? (
              fields.map(field => <FieldCard key={field.id} field={field} />)
            ) : (
              <p className="text-gray-500 text-center col-span-full">No fields available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
