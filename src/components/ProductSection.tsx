import { useEffect } from "react";
import { fetchProducts } from "../features/product/productApi";
import ProductCard from "./ProductCard";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductSection = () => {
  const dispatch = useAppDispatch();
  const { products: ProductList } = useAppSelector((state) => state.product);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch])
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
         <div className="hidden md:flex items-center gap-6">
          <button className="text-sm text-gray-900 font-medium border-b-2 border-green-600 pb-1">
            All Products
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-900 pb-1">
            Fruits & Nuts
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-900 pb-1">
            Vegetables
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-900 pb-1">
            Snacks
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-900 pb-1">
            Vegetables
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-900 pb-1">
            Drinks
          </button>
        </div>
      </div>
 
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {ProductList?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductSection;
