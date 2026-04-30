import { Star, ShoppingCart, Share2, Eye, Heart } from "lucide-react";
import type { IProduct } from "../features/product/productSlice";
import { useAppDispatch } from "../hooks/hooks";
import { createCart, type IAddToCart } from "../features/cart/cartApi";
interface IProductProps {
    product: IProduct;
}

const ProductCard = ({ product }: IProductProps) => {
    const rating = 4.5;
    const reviewCount = 128;
    const dispatch = useAppDispatch();

    const handleAddToCart = (product: IProduct) => {
        const { id, rate } = product;
        const payload: IAddToCart = {
            productId: id,
            quantity: 1,
            price: Number(rate)
        }
        dispatch(createCart(payload));
    };



    return (
        <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">

            <div className="relative aspect-square bg-gray-50 p-4 overflow-hidden">

                <img
                    src="https://www.freepnglogos.com/uploads/vegetables-png/vegetables-download-vegetable-photos-png-image-pngimg-3.png"
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
                        Sale
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="w-[70%] flex justify-center items-center gap-3 bg-white/80 backdrop-blur-md py-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">

                        <button className="p-2 rounded-full hover:bg-gray-200 transition">
                            <Eye className="w-4 h-4 text-gray-700" />
                        </button>



                        <button className="p-2 rounded-full hover:bg-red-100 transition">
                            <Heart className="w-4 h-4 text-gray-700 hover:text-red-500" />
                        </button>

                        <button className="p-2 rounded-full hover:bg-green-100 transition"
                            onClick={() => handleAddToCart(product)}>
                            <ShoppingCart className="w-4 h-4 text-gray-700 hover:text-green-600" />
                        </button>


                        <button className="p-2 rounded-full hover:bg-blue-100 transition">
                            <Share2 className="w-4 h-4 text-gray-700 hover:text-blue-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                <p className="text-xs text-green-600 font-medium mb-2">
                    Available Qty: {product.quantity}
                </p>

                <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <Star
                                key={index}
                                className={`w-3.5 h-3.5 ${index < Math.floor(rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({reviewCount})</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                                Rs.{parseFloat(product.rate).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                                Rs.{(parseFloat(product.rate) * 1.1).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">{product.unit}</span>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;