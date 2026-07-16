import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    Shield,
    RefreshCw,
    Leaf,
    Minus,
    Plus,
    Check,
    MapPin,
    Award,
    Clock,
    MessageCircle,
    Calendar,
    Send,
    Edit,
    Trash,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { getAllComments, createComment, deleteComment, updateComment } from "../features/comment/CommentApi";
import { useParams } from "react-router-dom";
import { clearMessage, deleteCommentFromState, updateCommentFromState, type IComment } from "../features/comment/CommentSlice";
import { clearMessage as clearCartMessage } from "../features/cart/cartSlice";
import toast from "react-hot-toast";
import { fetchProductWithBasketAlgo, getProductDetails } from "../features/product/productApi";
import { createCart, type IAddToCart } from "../features/cart/cartApi";

// Static features for all products
const staticFeatures = [
    "100% Organic & Chemical Free",
    "Farm Fresh & Hand-picked",
    "No artificial preservatives",
    "Rich in nutrients & antioxidants",
    "Farm-to-table delivery",
    "Quality guaranteed",
];



// Base64 placeholder image to avoid infinite loading
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 24 24' fill='none' stroke='%23999999' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

// Skeleton Components
const ProductImageSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 h-[610px] flex items-center justify-center animate-pulse">
        <div className="w-full h-full bg-gray-200"></div>
    </div>
);

const ProductInfoSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 w-24 bg-gray-200 rounded mb-3"></div>
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-3"></div>
        <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="mb-4">
            <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="mb-4">
            <div className="h-5 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="flex items-center gap-3">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div className="flex gap-3 mb-6">
            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
        </div>
        <div className="border-t pt-4">
            <div className="h-16 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const DescriptionSkeleton = () => (
    <div className="p-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
        <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-3"></div>
        <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
        </div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-3"></div>
        <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
        </div>
    </div>
);

const SingleProductPage = () => {
    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isProductLoading, setIsProductLoading] = useState(true);

    const dispatch = useAppDispatch();
    const { id } = useParams();
    const ProductId = Number(id);

    const { comments, loading, error, success, message } = useAppSelector((state) => state.comment);
    const { user } = useAppSelector((state) => state.auth);
    const { productDetails, loading: productLoading, marketBasketProducts } = useAppSelector((store) => store.product);

    useEffect(() => {
        // Set loading state
        setIsProductLoading(true);

        // Fetch product details and comments
        dispatch(getProductDetails(ProductId));
        dispatch(getAllComments(ProductId));
        dispatch(fetchProductWithBasketAlgo(ProductId));
        setImageError(false);

        // Scroll to top
        window.scrollTo(0, 0);
    }, [ProductId, dispatch]);


    // Update loading state when product data arrives
    useEffect(() => {
        if (!productLoading && productDetails) {
            setIsProductLoading(false);
        } else if (!productLoading && !productDetails && ProductId) {
            // If loading is done but no product details (product not found)
            setIsProductLoading(false);
        }
    }, [productLoading, productDetails, ProductId]);

    const handleDeleteReview = (commentId: number) => {
        dispatch(deleteComment(commentId));
        dispatch(deleteCommentFromState(commentId));
    };

    const handleEditReview = (review: IComment) => {
        const { id, comment, rating } = review;
        dispatch(updateComment({ id, comment, rating }));
        dispatch(updateCommentFromState({ id, comment, rating }));
    };

    const { loading: cartLoading, success: cartSuccess, error: cartError, message: cartMessage } = useAppSelector(
        (state) => state.cart
    );

    useEffect(() => {
        if (cartLoading) return;

        if (cartSuccess) {
            toast.success(cartMessage);
            dispatch(clearCartMessage());
        }

        if (cartError) {
            toast.error(cartMessage);
            dispatch(clearCartMessage());
        }
    }, [cartLoading, cartSuccess, cartError, cartMessage, dispatch]);

    useEffect(() => {
        if (loading) return;
        if (success) {
            message && toast.success(message);
            dispatch(clearMessage());
            setReviewComment("");
            setReviewRating(5);
            setIsSubmitting(false);
        }
        if (error) {
            toast.error(message);
            dispatch(clearMessage());
            setIsSubmitting(false);
        }
    }, [success, dispatch, message, error, loading, ProductId]);

    // Dynamic product data from API
    const product = productDetails || {
        id: 0,
        name: "Product Not Found",
        description: "Product details are not available at the moment.",
        unit: "kg",
        rate: "0",
        image: "",
        farmName: "Farm Name",
        categoryName: "Category",
    };

    const getImageUrl = () => {
        if (imageError) {
            return PLACEHOLDER_IMAGE;
        }
        if (!product.image || product.image === "") {
            return PLACEHOLDER_IMAGE;
        }
        if (product.image.startsWith("http")) {
            return product.image;
        }
        return `http://localhost:4000${product.image}`;
    };

    const handleImageError = () => {
        if (!imageError) {
            setImageError(true);
        }
    };

    const staticRating = 4.5;

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? 0 : numPrice;
    };

    const productPrice = formatPrice(product.rate);
    const originalPrice = productPrice;
    const discount = 0;

    const renderStars = (rating: number, size: string = "w-4 h-4") => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`${size} ${i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : i < rating
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-300"
                    }`}
            />
        ));
    };

    const handleSubmitReview = () => {
        if (!user) {
            toast.error("Please login to submit a review");
            return;
        }
        if (!reviewComment.trim()) {
            toast.error("Please write a review");
            return;
        }

        setIsSubmitting(true);
        const reviewData = {
            productId: ProductId,
            rating: reviewRating,
            comment: reviewComment,
        };

        dispatch(createComment(reviewData));
    };

    const handleAddToCart = (product: any) => {
        const { id, rate } = product;
        const payload: IAddToCart = {
            productId: id,
            quantity: quantity,
            price: Number(rate)
        };
        dispatch(createCart(payload));
    };

    // Show skeleton while loading
    if (isProductLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-5">
                    {/* Breadcrumb Skeleton */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <span>/</span>
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <span>/</span>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <span>/</span>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/2">
                            <ProductImageSkeleton />
                        </div>
                        <div className="lg:w-1/2">
                            <ProductInfoSkeleton />
                        </div>
                    </div>

                    {/* Tabs Skeleton */}
                    <div className="mt-8">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="flex border-b border-gray-200">
                                <div className="px-6 py-3 h-10 w-24 bg-gray-200 m-1 rounded animate-pulse"></div>
                                <div className="px-6 py-3 h-10 w-24 bg-gray-200 m-1 rounded animate-pulse"></div>
                            </div>
                            <DescriptionSkeleton />
                        </div>
                    </div>

                    {/* Related Products Skeleton */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                                    <div className="h-40 bg-gray-200"></div>
                                    <div className="p-3">
                                        <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-5">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
                    <Link to="/" className="hover:text-green-600 transition">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-green-600 transition">Products</Link>
                    <span>/</span>
                    <Link to={`/products/${product.categoryName?.toLowerCase()}`} className="hover:text-green-600 transition">
                        {product.categoryName || "Products"}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 h-[610px] flex items-center justify-center">
                            <img
                                src={product.image || "https://www.freepnglogos.com/uploads/vegetables-png/vegetables-download-vegetable-photos-png-image-pngimg-3.png"}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain cursor-pointer"
                                onError={handleImageError}
                            />
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-3">
                                <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded">
                                    {product.categoryName || "Fresh Produce"}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                <div className="flex items-center gap-1">
                                    {renderStars(staticRating)}
                                    <span className="text-sm font-medium text-gray-700 ml-1">{staticRating}</span>
                                </div>
                                <span className="text-sm text-gray-500">({comments?.length || 0} reviews)</span>
                                <div className="flex items-center gap-1 text-green-600">
                                    <Check className="w-4 h-4" />
                                    <span className="text-xs font-medium">In Stock</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-3xl font-bold text-green-600">Rs.{productPrice}</span>
                                    {originalPrice > productPrice && (
                                        <>
                                            <span className="text-lg text-gray-400 line-through">Rs.{Math.round(originalPrice)}</span>
                                            <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded">
                                                {discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes • Per {product.unit}</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-sm text-gray-600 mb-2 block">Quantity ({product.unit})</label>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                            className="w-9 h-9 flex items-center justify-center border-r border-gray-200 hover:text-green-600 transition"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-9 h-9 flex items-center justify-center border-l border-gray-200 hover:text-green-600 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Min. order: 1 {product.unit}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mb-6 flex-wrap">
                                <button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>
                                <button className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 rounded-lg transition flex items-center justify-center gap-2">
                                    <Heart className="w-4 h-4" />
                                    Wishlist
                                </button>
                                <button className="w-12 border border-gray-200 text-gray-500 hover:text-green-600 rounded-lg transition flex items-center justify-center">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <Truck className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-800">Free Delivery</p>
                                        <p className="text-xs text-gray-500">On orders Rs.1000+</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-800">Same Day Delivery</p>
                                        {/* <p className="text-xs text-gray-500">Order before 2 PM</p> */}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-800">Fresh Guarantee</p>
                                        <p className="text-xs text-gray-500">100% quality assured</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <RefreshCw className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-800">Easy Returns</p>
                                        {/* <p className="text-xs text-gray-500">7 days return policy</p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Leaf className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{product.farmName || "Local Farm"}</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs text-gray-600">
                                                    4.5 · Fresh Produce
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <MapPin className="w-3 h-3" />
                                    <span>Local Farm, Nepal</span>
                                    <span>•</span>
                                    <Award className="w-3 h-3" />
                                    <span>Premium Quality</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs Section */}
                <div className="mt-8">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="flex border-b border-gray-200 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`px-6 py-3 text-sm font-medium transition whitespace-nowrap ${activeTab === "description"
                                    ? "text-green-600 border-b-2 border-green-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={`px-6 py-3 text-sm font-medium transition whitespace-nowrap ${activeTab === "reviews"
                                    ? "text-green-600 border-b-2 border-green-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Reviews ({comments?.length || 0})
                            </button>
                        </div>

                        {activeTab === "description" && (
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description || "No description available for this product."}
                                </p>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Product Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Unit:</span>
                                        <span className="text-gray-800 font-medium">{product.unit}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Category:</span>
                                        <span className="text-gray-800 font-medium">{product.categoryName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Farm:</span>
                                        <span className="text-gray-800 font-medium">{product.farmName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Availability:</span>
                                        <span className="text-green-600 font-medium">In Stock</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {staticFeatures.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-green-600" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="p-6">
                                {/* Rating Summary */}
                                <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-6 border-b">
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-800">{staticRating}</div>
                                            <div className="flex items-center gap-1 mt-1">{renderStars(staticRating)}</div>
                                            <div className="text-sm text-gray-500 mt-1">Based on {comments?.length || 0} reviews</div>
                                        </div>
                                    </div>
                                </div>

                                {user ? (
                                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
                                        <div className="mb-3">
                                            <label className="block text-sm text-gray-600 mb-2">Your Rating</label>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setReviewRating(star)}
                                                        onMouseEnter={() => setHoveredRating(star)}
                                                        onMouseLeave={() => setHoveredRating(0)}
                                                        className="focus:outline-none"
                                                    >
                                                        <Star
                                                            className={`w-6 h-6 transition ${(hoveredRating || reviewRating) >= star
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-sm text-gray-600 mb-2">Your Review</label>
                                            <textarea
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                rows={3}
                                                placeholder="Share your experience with this product..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSubmitReview}
                                            disabled={isSubmitting}
                                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit Review
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                                        <p className="text-gray-600">
                                            Please <Link to="/login" className="text-green-600 hover:underline">login</Link> to write a review
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-500 mt-2">Loading reviews...</p>
                                        </div>
                                    ) : comments?.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                                        </div>
                                    ) : (
                                        comments?.map((review) => (
                                            <div key={review.id} className="pb-6 border-b last:border-b-0">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <span className="text-green-600 font-semibold">
                                                            {review.createdByName?.charAt(0).toUpperCase() || "U"}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                                                            <div>
                                                                <h4 className="font-medium text-gray-800">{review.createdByName || "User"}</h4>
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    {renderStars(review.rating, "w-3.5 h-3.5")}
                                                                </div>
                                                            </div>

                                                            <div className="">
                                                                {user && Number(user.id) === Number(review.createdBy) && (
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <button
                                                                            onClick={() => handleDeleteReview(review.id)}
                                                                            className="text-xs text-red-600 hover:underline"
                                                                        >
                                                                            <Trash className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleEditReview(review)}
                                                                            className="text-xs text-green-600 hover:underline"
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                <div className="flex text-xs text-gray-400 gap-2">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section - Static */}
                {marketBasketProducts && marketBasketProducts.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">You May Also Like</h3>
                            <Link to="/products" className="text-sm text-green-600 hover:underline">View All</Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {marketBasketProducts?.map((item) => (
                                <Link key={item.id} to={`/products/${item.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden group">
                                    <div className="relative">
                                        <img
                                            src={item?.image || "https://www.freepnglogos.com/uploads/vegetables-png/vegetables-download-vegetable-photos-png-image-pngimg-3.png"}
                                            alt={item.name}
                                            className="w-full h-40 object-contain group-hover:scale-105 transition duration-300"
                                        />
                                        <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-green-600 hover:text-white transition"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleAddToCart(item);
                                            }}
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                                            {item.rate}
                                        </span>

                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs text-gray-600">{item.rating}</span>
                                        </div>
                                        <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400">Rs.{item.rate}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleProductPage;