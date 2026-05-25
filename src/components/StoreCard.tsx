import { MapPin, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IStore {
  id: number;
  farmName: string;
  description: string;
  address: string;
}

interface IStoreCardProps {
  store: IStore;
}

const StoreCard = ({ store }: IStoreCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/stores/${store.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img
          src="https://as1.ftcdn.net/v2/jpg/13/74/60/08/1000_F_1374600863_2ed7RnXS7sUGgv85i0fp9xVqjVhgXS9u.jpg"
          alt="Store"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold">
          Popular Store
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/80 px-2 py-1 rounded text-xs">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span>4.8</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {store.farmName}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
          {store.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-600 mt-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{store.address}</span>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;