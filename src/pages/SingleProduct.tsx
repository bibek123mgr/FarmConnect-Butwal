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
import toast from "react-hot-toast";

const SingleProductPage = () => {
    const [activeTab, setActiveTab] = useState("description");
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();
    const { id } = useParams();
    const ProductId = Number(id);

    const { comments, loading, error, success, message } = useAppSelector((state) => state.comment);

    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getAllComments(ProductId));
    }, []);

    const handleDeleteReview = (commentId: number) => {
        dispatch(deleteComment(commentId));
        dispatch(deleteCommentFromState(commentId));
    }

    const handleEditReview = (review:IComment) => {
        const { id, comment, rating } = review;
        dispatch(updateComment({ id, comment, rating }));
        dispatch(updateCommentFromState({ id, comment, rating }));
    }

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

    const product = {
        id: 1,
        name: "Organic Fresh Apples - Himalayan Variety",
        price: 180,
        originalPrice: 220,
        discount: 18,
        rating: 4.5,
        reviews: 128,
        inStock: true,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
        images: [
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
            "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=500",
            "https://images.unsplash.com/photo-1579613832111-ac7dfcc7723e?w=500",
            "https://images.unsplash.com/photo-1513279922550-250c2129b6eb?w=500",
        ],
        category: "Fresh Fruits",
        unit: "kg",
        minOrder: 1,
        maxOrder: 10,
        description:
            "Fresh, crispy, and naturally sweet apples grown in the Himalayan foothills. Our apples are hand-picked at peak ripeness and delivered within 24 hours of harvest. These organic apples are free from harmful pesticides and chemicals, making them a healthy choice for your family.",
        features: [
            "100% Organic & Chemical Free",
            "Hand-picked at peak ripeness",
            "Fresh from Himalayan orchards",
            "No artificial wax or coating",
            "Rich in antioxidants & fiber",
            "Farm-to-table within 24 hours",
        ],
        seller: {
            name: "Himalayan Organic Farms",
            location: "Mustang, Nepal",
            rating: 4.8,
            products: 45,
            since: 2015,
        },
    };

    const relatedProducts = [
        {
            id: 2,
            name: "Organic Red Apples",
            price: 190,
            originalPrice: 240,
            image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=200",
            rating: 4.3,
        },
        {
            id: 3,
            name: "Fresh Green Apples",
            price: 170,
            originalPrice: 210,
            image: "https://images.unsplash.com/photo-1579613832111-ac7dfcc7723e?w=200",
            rating: 4.6,
        },
        {
            id: 4,
            name: "Golden Delicious",
            price: 200,
            originalPrice: 250,
            image: "https://images.unsplash.com/photo-1579613832111-ac7dfcc7723e?w=200",
            rating: 4.4,
        },
        {
            id: 5,
            name: "Organic Pears",
            price: 160,
            originalPrice: 200,
            image: "https://images.unsplash.com/photo-1513279922550-250c2129b6eb?w=200",
            rating: 4.7,
        },
    ];

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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-5">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-green-600 transition">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-green-600 transition">Products</Link>
                    <span>/</span>
                    <Link to="/products/fruits" className="hover:text-green-600 transition">Fruits</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Product Images */}
                    <div className="lg:w-1/2">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-auto object-cover cursor-pointer"
                            />
                        </div>
                        <div className="flex gap-3">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg border-2 ${selectedImage === index ? "border-green-600" : "border-gray-200"
                                        } overflow-hidden hover:border-green-600 transition`}
                                >
                                    <img src={img} alt={`Product view ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="lg:w-1/2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-3">
                                <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1">
                                    {renderStars(product.rating)}
                                    <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                                </div>
                                <span className="text-sm text-gray-500">({comments?.length || 0} reviews)</span>
                                <div className="flex items-center gap-1 text-green-600">
                                    <Check className="w-4 h-4" />
                                    <span className="text-xs font-medium">In Stock</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                                    <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded">
                                        {product.discount}% OFF
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes • Free delivery on orders above ₹1000</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-sm text-gray-600 mb-2 block">Quantity ({product.unit})</label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                            className="w-9 h-9 flex items-center justify-center border-r border-gray-200 hover:text-green-600 transition"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                                        <button
                                            onClick={() => quantity < product.maxOrder && setQuantity(quantity + 1)}
                                            className="w-9 h-9 flex items-center justify-center border-l border-gray-200 hover:text-green-600 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Min. order: {product.minOrder} {product.unit} | Max: {product.maxOrder} {product.unit}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mb-6">
                                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2">
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
                                        <p className="text-xs text-gray-500">On orders ₹1000+</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-800">Same Day Delivery</p>
                                        <p className="text-xs text-gray-500">Order before 2 PM</p>
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
                                        <p className="text-xs text-gray-500">7 days return policy</p>
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
                                            <p className="text-sm font-medium text-gray-800">{product.seller.name}</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs text-gray-600">
                                                    {product.seller.rating} · {product.seller.products} products
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link to="/seller/1" className="text-xs text-green-600 hover:underline">View Shop</Link>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <MapPin className="w-3 h-3" />
                                    <span>{product.seller.location}</span>
                                    <span>•</span>
                                    <Award className="w-3 h-3" />
                                    <span>Since {product.seller.since}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs Section */}
                <div className="mt-8">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`px-6 py-3 text-sm font-medium transition ${activeTab === "description"
                                    ? "text-green-600 border-b-2 border-green-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={`px-6 py-3 text-sm font-medium transition ${activeTab === "reviews"
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
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Product Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                    {product.features.map((feature, idx) => (
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
                                            <div className="text-4xl font-bold text-gray-800">{product.rating}</div>
                                            <div className="flex items-center gap-1 mt-1">{renderStars(product.rating)}</div>
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
                                )

                                    : (
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
                                                            {review.createdByName?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                                                            <div>
                                                                <h4 className="font-medium text-gray-800">{review.createdByName}</h4>
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    {renderStars(review.rating, "w-3.5 h-3.5")}
                                                                </div>
                                                            </div>

                                                            <div className="">
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

                {/* Related Products Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">You May Also Like</h3>
                        <Link to="/products" className="text-sm text-green-600 hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {relatedProducts.map((item) => (
                            <Link key={item.id} to={`/product/${item.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden group">
                                <div className="relative">
                                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover group-hover:scale-105 transition duration-300" />
                                    <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-green-600 hover:text-white transition">
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                    </button>
                                    {item.originalPrice && (
                                        <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs text-gray-600">{item.rating}</span>
                                    </div>
                                    <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-semibold text-gray-800 text-sm">₹{item.price}</span>
                                        <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProductPage;