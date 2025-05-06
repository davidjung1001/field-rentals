// src/components/CategorySection.jsx
import CategoryCard from "./CategoryCard";

const categories = [
  { name: "Futsal", image: `${process.env.PUBLIC_URL}/images/futsal.jpg` },
  { name: "Full Field", image: `${process.env.PUBLIC_URL}/images/full-field.jpg` },
  { name: "Small Sided", image: `${process.env.PUBLIC_URL}/images/small-sided.jpg` },
];

const CategorySection = ({ applyFilters }) => {
  return (
    <div className="py-10 px-4 md:px-10 bg-white max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Browse by Category</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.name}
            name={cat.name}
            image={cat.image}
            onClick={() => applyFilters({ category: [cat.name] })}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
