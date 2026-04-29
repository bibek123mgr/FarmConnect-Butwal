import type { ICategory } from "../features/category/CategorySlice";

interface ICategoryProps {
  category: ICategory;
}

const colors = [
  "from-green-100 to-green-200",
  "from-orange-100 to-orange-200",
  "from-pink-100 to-pink-200",
  "from-yellow-100 to-yellow-200",
  "from-blue-100 to-blue-200",
  "from-purple-100 to-purple-200",
];

const CategoryCard = ({ category }: ICategoryProps) => {
  const randomColor =
    colors[category.id % colors.length];

  return (
    <div className="flex flex-col items-center cursor-pointer group min-w-[100px]">
      <div
        className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${randomColor}
        p-1 shadow-md group-hover:scale-105 transition-transform duration-300`}
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Category Name */}
      <p className="mt-3 text-sm font-medium text-gray-700 text-center group-hover:text-green-600 transition">
        {category.name}
      </p>
    </div>
  );
};

export default CategoryCard;