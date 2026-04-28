
interface IProductProps {
    product: IProduct
}
import { 
  Leaf,
  Heart
} from 'lucide-react';
import type { IProduct } from '../features/product/productSlice';

const ProductCard = ({ product }: IProductProps) => {
    return (
        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
            {/* Product Image Placeholder */}
            <div className="relative h-48 bg-green-100 flex items-center justify-center">
                <Leaf className="w-16 h-16 text-green-300" />
                
                <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium `}>
                </span>
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800 text-lg leading-tight">{product.name}</h3>
                </div>
                <p className="text-xs text-green-600 mb-1">{product.farmName}</p>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                        {product.categoryName}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">Left: {product.quantity} {product.unit}s</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div>
                        <span className="text-2xl font-bold text-green-700">Rs.{parseFloat(product.rate).toFixed(2)}</span>
                        <span className="text-sm text-gray-500"> / {product.unit}</span>
                    </div>
                    <button
                        className={`px-4 py-2 rounded-lg font-medium transition text-sm bg-green-600 text-white hover:bg-green-700
                                `}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
