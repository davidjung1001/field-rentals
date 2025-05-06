import HeroSearch from "./HeroSearch";

const HeroSection = ({ searchQuery, setSearchQuery, applyFilters }) => {
  return (
    <div className="relative w-full h-[700px] md:h-[800px]">
      {/* ✅ Background Image */}
      <img
        src={`${process.env.PUBLIC_URL}/images/hero.jpg`}
        alt="Soccer Field"
        className="absolute inset-0 w-full h-full object-cover brightness-60"
      />

      {/* ✅ Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10" />

      {/* ✅ Foreground Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center drop-shadow-lg mb-6">
          Find & Book Soccer Fields Near You
        </h1>

        {/* ✅ Search */}
        <div className="w-full max-w-3xl">
          <HeroSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            applyFilters={applyFilters}
          />
        </div>

        {/* ✅ Scroll Button */}
        <button
          onClick={() => document.getElementById("listings-section")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-10 bg-white text-black px-6 py-3 rounded-full font-semibold text-sm md:text-base shadow-md hover:bg-gray-200 transition"
        >
          Browse Fields
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
