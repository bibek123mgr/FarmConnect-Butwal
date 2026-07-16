import { Star, ShoppingCart, Share2, Eye, Heart } from "lucide-react";
import type { IProduct } from "../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { createCart, type IAddToCart } from "../features/cart/cartApi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface IProductProps {
    product: IProduct;
}

const ProductCard = ({ product }: IProductProps) => {
    const rating = 4.5;
    const reviewCount = 128;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isInWishlist, setIsInWishlist] = useState(false);


    const { user } = useAppSelector((state) => state.auth);
    // Check if product is in wishlist on mount
    useEffect(() => {
        const storedWishlist = localStorage.getItem("wishlist");
        if (storedWishlist) {
            const wishlistItems = JSON.parse(storedWishlist);
            const exists = wishlistItems.some((item: any) => item.id === product.id);
            setIsInWishlist(exists);
        }
    }, [product.id]);

    const handleAddToCart = (product: IProduct) => {
        if (!user) {
            toast.error("Please log in to add items to the cart.");
            return;
        }
        const { id, rate } = product;
        const payload: IAddToCart = {
            productId: id,
            quantity: 1,
            price: Number(rate)
        }
        dispatch(createCart(payload));
    };

    const handleNavigateToProductdetails = (productId: number) => {
        navigate(`/products/${productId}`);
    }

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();

        const storedWishlist = localStorage.getItem("wishlist");
        let wishlistItems = storedWishlist ? JSON.parse(storedWishlist) : [];

        if (isInWishlist) {
            // Remove from wishlist
            wishlistItems = wishlistItems.filter((item: any) => item.id !== product.id);
            setIsInWishlist(false);
        } else {
            // Add to wishlist
            const wishlistItem = {
                id: product.id,
                productName: product.name,
                price: Number(product.rate),
                image: product.image,
                category: product?.categoryName || "Products",
                inStock: product.quantity > 0,
                quantity: product.quantity
            };
            wishlistItems.push(wishlistItem);
            setIsInWishlist(true);
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const productUrl = `${window.location.origin}/products/${product.id}`;
        navigator.clipboard.writeText(productUrl)
            .then(() => {
                toast.success("Product link copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy product link.");
            });
    };

    return (
        <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleNavigateToProductdetails(product.id)}
        >
            <div className="relative aspect-square bg-gray-50 p-4 overflow-hidden">
                <img
                    src={product.image || "https://www.freepnglogos.com/uploads/vegetables-png/vegetables-download-vegetable-photos-png-image-pngimg-3.png"}
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
                        <button
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToProductdetails(product.id);
                            }}
                        >
                            <Eye className="w-4 h-4 text-gray-700" />
                        </button>

                        <button
                            className={`p-2 rounded-full transition ${isInWishlist ? 'bg-red-100' : 'hover:bg-red-100'}`}
                            onClick={handleToggleWishlist}
                        >
                            <Heart className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-700 hover:text-red-500'}`} />
                        </button>

                        <button
                            className="p-2 rounded-full hover:bg-green-100 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                            }}
                        >
                            <ShoppingCart className="w-4 h-4 text-gray-700 hover:text-green-600" />
                        </button>

                        <button
                            className="p-2 rounded-full hover:bg-blue-100 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShare(e);
                            }}
                        >
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