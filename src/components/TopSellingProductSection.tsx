import { useEffect } from "react";
import { fetchProducts, fetchTopSellingProducts } from "../features/product/productApi";
import ProductCard from "./ProductCard";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import toast from "react-hot-toast";
import { clearMessage } from "../features/cart/cartSlice";
import ProductCardSkeleton from "./ProductCardSkleton";

const TopSellingProductSection = () => {
  const dispatch = useAppDispatch();
  const { topSellingProducts: ProductList, loading: productLoading } = useAppSelector((state) => state.product);
  useEffect(() => {
    dispatch(fetchTopSellingProducts());
  }, [dispatch])

  const { loading, success, error, message } = useAppSelector(
    (state) => state.cart
  )
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
        <h2 className="text-2xl font-bold text-gray-900">Best Selling Products</h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {
          productLoading
            ? [...Array(5)].map((_, index) => (
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

export default TopSellingProductSection;
