const CategoryCard = ({ name, image, onClick }) => {
  return (
    <div 
      className="relative w-[350px] md:w-[450px] h-[250px] md:h-[300px] cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105"
      onClick={onClick}
    >
      {/* ✅ Full-size background image */}
      <img src={image} alt={name} className="w-full h-full object-cover rounded-lg" />

      {/* ✅ Overlay text */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <p className="text-white text-lg md:text-2xl font-bold">{name}</p>
      </div>
    </div>
  );
};

export default CategoryCard; // ✅ Now correctly exported!
