import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fetchFarms } from "../features/farm/farmApi";
import StoreCardSkeleton from "./StoreCardSkleton";
import StoreCard from "./StoreCard";

const TopSellingStoreSection = () => {
  const dispatch = useAppDispatch();
  const { topSellingFarms, loading } = useAppSelector((state) => state.store);
  useEffect(() => {
    dispatch(fetchFarms());
  }, [dispatch])


  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular Stores</h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {
          loading
            ? [...Array(5)].map((_, index) => (
              <StoreCardSkeleton key={index} />
            ))
            :
            topSellingFarms?.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
      </div>
    </div>
  );
}

export default TopSellingStoreSection;
