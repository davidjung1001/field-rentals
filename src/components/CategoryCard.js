const CategoryCard = ({ name, image, onClick, className = "" }) => {
  return (
    <div
      className={`relative w-[350px] md:w-[450px] h-[250px] md:h-[320px] cursor-pointer rounded-xl overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl ${className}`}
      onClick={onClick}
    >
      {/* Background image */}
      <img src={image} alt={name} className="w-full h-full object-cover rounded-xl" />

      {/* Overlay text */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
        <p className="text-white text-lg md:text-2xl font-semibold text-center">{name}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
