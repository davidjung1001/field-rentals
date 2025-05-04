import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import FieldCard from "../components/FieldCard";
import HeroSearch from "../components/HeroSearch";
import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard"; // ✅ Import Category Card Component

const categories = [
  { name: "Futsal", image: `${process.env.PUBLIC_URL}/images/futsal.jpg` },
  { name: "Full Field", image: `${process.env.PUBLIC_URL}/images/full-field.jpg` },
  { name: "7v7", image: `${process.env.PUBLIC_URL}/images/7v7.jpg` },
  { name: "Small Sided", image: `${process.env.PUBLIC_URL}/images/small-sided.jpg` },
];

const Home = () => {
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "", priceRange: 1000, type: [], surface: [], category: []
  });

  // ✅ Preserve previous filters instead of resetting them
  const applyFilters = (newFilters) => {
    console.log("Applying Filters:", newFilters);

    setFilters((prevFilters) => ({
      ...prevFilters, // ✅ Merge previous filters instead of overwriting
      location: newFilters.location || prevFilters.location,
      priceRange: typeof newFilters.priceRange === "number" ? newFilters.priceRange : prevFilters.priceRange, 
      type: Array.isArray(newFilters.type) ? newFilters.type : prevFilters.type, 
      surface: Array.isArray(newFilters.surface) ? newFilters.surface : prevFilters.surface, 
      category: Array.isArray(newFilters.category) ? newFilters.category : prevFilters.category
    }));
  };

  const handleCategorySelect = (category) => {
    console.log("Filtering by category:", category);
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: [category],
    }));
  };

  // ✅ Fetch fields from Firestore
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "soccerFields"));
        if (!querySnapshot || querySnapshot.empty) {
          console.error("Error: No fields were retrieved!");
          setFields([]);
          return;
        }

        const fieldList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          images: doc.data().images || [],
          location: doc.data().location || "No location provided",
        }));

        console.log("Fetched Fields:", fieldList);
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

  // ✅ Ensure search refines results instead of resetting listings
  useEffect(() => {
    console.log("Filters before applying:", filters);
    console.log("Fields Data Before Filtering:", fields);

    if (!Array.isArray(fields)) {
      console.error("Error: Fields is not an array!", fields);
      return;
    }

    const results = fields.filter(field =>
      (!searchQuery || field.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!filters.location || field.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.priceRange || field.price_per_hour <= filters.priceRange) &&
      (!Array.isArray(filters.type) || filters.type.length === 0 || filters.type.includes(field.type)) &&
      (!Array.isArray(filters.surface) || filters.surface.length === 0 || filters.surface.includes(field.surface)) &&
      (!Array.isArray(filters.category) || filters.category.length === 0 || filters.category.includes(field.category))
    );

    console.log("Filtered Results:", results);

    // ✅ Preserve previous results unless filtering is applied
    setFilteredFields(results.length > 0 ? results : fields);
  }, [searchQuery, filters, fields]);

  return (
    <div className="relative flex flex-col">
      
      {/* ✅ Navbar (Fixed at the top) */}
      <Navbar />

      {/* ✅ Hero Section */}
      <div className="relative w-full h-[500px]">
        <img 
          src={`${process.env.PUBLIC_URL}/images/hero.jpg`} 
          alt="Soccer Field" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white w-full px-4">
          <HeroSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            applyFilters={applyFilters} 
          />
        </div>
      </div>

      {/* ✅ Larger, Image-Based Category Cards Section (Above Field Listings) */}
      <div className="w-full flex justify-center flex-wrap gap-6 my-8">
        {categories.map((cat) => (
          <CategoryCard 
            key={cat.name} 
            name={cat.name} 
            image={cat.image} 
            onClick={() => handleCategorySelect(cat.name)} 
          />
        ))}
      </div>

      {/* ✅ Field Listings */}
      <div id="fields" className="relative bg-white p-6 rounded-t-3xl shadow-xl z-10">
        <h2 className="text-2xl font-bold text-center mb-4">Available Fields</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? <p className="text-gray-500 text-center">Loading fields...</p> 
          : error ? <p className="text-red-500 text-center">{error}</p> 
          : filteredFields.length > 0 ? filteredFields.map(field => <FieldCard key={field.id} field={field} />) 
          : <p className="text-gray-500 text-center">No fields match the selected filters.</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;