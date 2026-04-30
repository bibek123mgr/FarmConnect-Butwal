import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchCategories } from "../features/category/CategoryApi";
import CategoryCard from "./CategoryCard";

const CategorySection = () => {
  const dispatch = useAppDispatch();
  const { categories: categoryList } = useAppSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  return (
    <div className="w-full overflow-hidden py-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Shop by Category
      </h1>
      <div className="marquee-container">
        <div className="marquee-track">
          {categoryList?.slice(0, 10).map((category, index) => (
            <div key={`${category.id}-${index}`} className="flex-shrink-0">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;