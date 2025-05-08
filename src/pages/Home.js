import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CategoryCard from "../components/CategoryCard";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    priceRange: 1000,
    type: [],
    surface: [],
    category: [],
  });

  const [hideHero, setHideHero] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHideHero(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowCategory(true);
          } else {
            setShowCategory(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    const categorySection = document.getElementById("category-section");
    if (categorySection) observer.observe(categorySection);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen space-y-16">
      {/* ✅ Hero Section */}
      <section
        className={`transition-all duration-500 ease-in-out ${
          hideHero ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          applyFilters={setFilters}
        />
      </section>

      {/* ✅ Category Section */}
      <section
  id="category-section"
  className="w-full flex flex-col items-center bg-gradient-to-b from-black to-gray-800 px-4 py-16 sm:py-24 transition-all duration-500 ease-in-out"
>
  <h2
    className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-10 text-white text-center transition-all duration-700 ${
      showCategory ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
    }`}
  >
    Discover Your Next Move
  </h2>

  <div className="max-w-6xl w-full rounded-2xl shadow-lg px-2 sm:px-6 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8">
    <CategoryCard
      name="Get Playing"
      image={`${process.env.PUBLIC_URL}/images/pickup_games.jpg`}
      onClick={() => navigate("/pickup-soccer")}
      className={`transition-all duration-700 ease-in-out ${
        showCategory
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-95"
      }`}
    />
    <CategoryCard
      name="Join the Discussion"
      image={`${process.env.PUBLIC_URL}/images/forum_threads.jpg`}
      onClick={() => navigate("/pickup-chat")}
      className={`transition-all duration-700 ease-in-out ${
        showCategory
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-95"
      }`}
    />
  </div>
</section>

    </div>
  );
};

export default Home;
