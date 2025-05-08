import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CategoryCard from "../components/CategoryCard"; // ✅ Import CategoryCard

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ location: "", priceRange: 1000, type: [], surface: [], category: [] });

  // ✅ Visibility states for sections
  const [hideHero, setHideHero] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  // ✅ Handles scrolling effects
  useEffect(() => {
    const handleScroll = () => setHideHero(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Intersection Observer for Category Animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowCategory(true);
        } else {
          setShowCategory(false);
        }
      });
    }, { threshold: 0.3 });

    const categorySection = document.getElementById("category-section");
    if (categorySection) observer.observe(categorySection);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen space-y-16">
      
      {/* ✅ Hero Section */}
      <section 
        className={`transition-all duration-500 ease-in-out ${hideHero ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} applyFilters={setFilters} />
      </section>

      {/* ✅ Animated Category Cards with Background */}
      <section 
  id="category-section" 
  className={`relative px-6 md:px-12 lg:px-24 transition-all duration-500 ease-in-out ${
    hideHero ? "mt-4 py-6" : "mt-20 py-8"
  } flex justify-center bg-gradient-to-b from-gray-600 to-gray-700 rounded-xl shadow-xl`}
>

        <div className="flex gap- md:gap-12 lg:gap-16">
          
          {/* ✅ Pickup Games Card */}
          <CategoryCard 
            name="Join a Pickup Game" 
            image={`${process.env.PUBLIC_URL}/images/pickup_games.jpg`}

            onClick={() => navigate("/pickup-soccer")}
            className={`transition-all duration-700 ease-in-out 
              ${showCategory ? "opacity-100 translate-y-[-5px] scale-110 shadow-lg" : "opacity-0 translate-y-10 scale-90"}
            `}
          />

          {/* ✅ Threads Card */}
          <CategoryCard 
            name="Join the Discussion" 
            image="/images/forum_threads.jpg"
            onClick={() => navigate("/pickup-chat")}
            className={`transition-all duration-700 ease-in-out 
              ${showCategory ? "opacity-100 translate-y-[-5px] scale-110 shadow-lg" : "opacity-0 translate-y-10 scale-90"}
            `}
          />

        </div>
      </section>

    </div>
  );
};

export default Home;
