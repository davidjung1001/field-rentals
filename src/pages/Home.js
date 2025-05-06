import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, startAfter, limit, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySelection";
import FieldListings from "../components/FieldListings"; // ✅ Modularized Field Listings

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ location: "", priceRange: 1000, type: [], surface: [], category: [] });
  const [hideHero, setHideHero] = useState(false); 

  // Scroll event to hide hero section
  useEffect(() => {
    const handleScroll = () => {
      setHideHero(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Animation */}
      <div className={`transition-all duration-500 ease-in-out ${hideHero ? 'opacity-0 translate-y-[-150px]' : 'opacity-100 translate-y-0'}`}>
        <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} applyFilters={setFilters} />
      </div>

      {/* Category Section - Add more spacing */}
      <div className="mt-16 px-6 md:px-12 lg:px-24"> {/* ✅ Wider padding */}
        <CategorySection applyFilters={setFilters} />
      </div>

      {/* Listings Section - More spacing and wider container */}
      <div id="listings-section" className="relative z-10 px-6 md:px-12 lg:px-24 mt-20"> {/* ✅ Adjusted spacing */}
        <FieldListings />
      </div>
    </div>
  );
};

export default Home;