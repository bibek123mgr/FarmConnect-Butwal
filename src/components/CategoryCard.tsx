import { useNavigate } from "react-router-dom";
import type { ICategory } from "../features/category/CategorySlice";

interface ICategoryProps {
  category: ICategory;
}

const colors = [
  "bg-orange-50",
  "bg-green-50",
  "bg-orange-100",
  "bg-pink-50",
  "bg-yellow-50",
  "bg-blue-50",
  "bg-emerald-50",
  "bg-purple-50",
  "bg-red-50",
  "bg-amber-50",
];


const CategoryCard = ({ category }: ICategoryProps) => {
  const randomColor = colors[category.id % colors.length];

  const navigate = useNavigate();

const handleNavigate = () => {
  navigate(`/products?page=1&limit=20&productname=all&category=${category.id}&pricerangeFrom=0&pricerangeTo=max&store=all`);
};

  return (
    <div 
    className="flex flex-col items-center gap-2 cursor-pointer group"
    onClick={handleNavigate}
    >
      <div
        className={`${randomColor} rounded-2xl px-4 py-5 md:px-6 md:py-6 
        flex flex-col items-center justify-center min-w-[120px] md:min-w-[140px]
        group-hover:shadow-md transition-all duration-300`}
      >
        <img
          src={category.image}
          alt={category.name}
          className="w-14 h-14 md:w-18 md:h-18 object-contain"
        />

        <p className="mt-2 text-xs md:text-sm font-medium text-gray-700 text-center">
          {category.name}
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;