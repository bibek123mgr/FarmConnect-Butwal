import { useEffect } from "react";
import { fetchProducts } from "../features/product/productApi";
import ProductCard from "./ProductCard";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import toast from "react-hot-toast";
import { clearMessage } from "../features/cart/cartSlice";
import ProductCardSkeleton from "./ProductCardSkleton";

const ProductSection = () => {
  const dispatch = useAppDispatch();
  const { products: ProductList, loading: productLoading } = useAppSelector((state) => state.product);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch])

  const { loading, success, error, message } = useAppSelector(
    (state) => state.cart
  )
  console.log(ProductList);
  useEffect(() => {
    if (loading) return;

    if (success) {
      toast.success(message);
      dispatch(clearMessage());
    }

    if (error) {
      toast.error(message);
      dispatch(clearMessage());
    }
  }, [success, error]);
  return (
    <div className="container mx-auto py-8">
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
        {
          productLoading
            ? [...Array(10)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
            :
            ProductList?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
}

export default ProductSection;
