import { useEffect } from "react";
import { fetchProducts } from "../features/product/productApi";
import ProductCard from "./ProductCard";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const ProductSection = () => {
  const dispatch = useAppDispatch();
  const { products: ProductList } = useAppSelector((state) => state.product);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch])
  return (
    <div>
      <h1>Product Section</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ProductList?.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductSection;
