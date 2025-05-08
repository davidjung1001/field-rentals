const HeroSection = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <img
        src={`${process.env.PUBLIC_URL}/images/hero.jpg`}
        alt="Soccer Field"
        className="absolute inset-0 w-full h-full object-cover brightness-60"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent z-10" />

      {/* Foreground Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center drop-shadow-xl mb-6 leading-tight">
          Unite. Play. Belong.
        </h1>
        <p className="text-lg md:text-xl text-center max-w-2xl mb-8 text-gray-200">
          Discover local games and build your soccer community across your city.
        </p>

        {/* Future visual element (image/animation/etc.) */}
        {/* <img src="/images/soccer-icon.png" alt="Soccer Icon" className="w-24 h-24 mb-6" /> */}

        {/* Downward scroll arrow */}
        <div
          onClick={() =>
            document.getElementById("listings-section")?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-12 animate-bounce cursor-pointer"
        >
          <svg
            className="w-8 h-8 text-white opacity-80 hover:opacity-100 transition"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
