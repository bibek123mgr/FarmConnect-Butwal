import { Link } from "react-router-dom";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Tag,
  Truck,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createCart, type IAddToCart } from "../features/cart/cartApi";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import toast from "react-hot-toast";

interface WishlistItem {
  id: number;
  productName: string;
  price: number;
  image?: string;
  category?: string;
  inStock?: boolean;
  quantity?: number;
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  const updateWishlist = (newWishlist: WishlistItem[]) => {
    setWishlistItems(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  const handleRemove = (id: number) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    updateWishlist(updatedWishlist);
  };
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const moveToCart = (item: WishlistItem) => {
    if (!user) {
      toast.error("Please log in to add items to the cart.");
      return;
    }
    const { id, price: rate } = item;
    const payload: IAddToCart = {
      productId: id,
      quantity: 1,
      price: Number(rate)
    }
    dispatch(createCart(payload));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in
            your wishlist
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {wishlistItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-400 mb-6">
                  Start adding items you love to your wishlist!
                </p>
                <Link
                  to="/products"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 border-b">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-1 text-center">Action</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-gray-100">
                  {wishlistItems?.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center">
                        <div className="flex gap-3 md:col-span-6 mb-3 md:mb-0">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150"}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <Link
                              to={`/products/${item.id}`}
                              className="font-medium text-gray-800 hover:text-green-600 transition"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.category || "Products"}
                            </p>
                          </div>
                        </div>

                        <div className="md:col-span-2 mb-2 md:mb-0">
                          <div className="flex items-center justify-between md:justify-center">
                            <span className="text-sm text-gray-500 md:hidden">
                              Price:
                            </span>
                            <span className="font-medium text-gray-800">
                              Rs.{item.price}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-2 mb-2 md:mb-0">
                          <div className="flex items-center justify-between md:justify-center">
                            <span className="text-sm text-gray-500 md:hidden">
                              Status:
                            </span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.inStock !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}>
                              {item.inStock !== false ? "Available" : "Out of Stock"}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-1 mb-2 md:mb-0">
                          <div className="flex items-center justify-between md:justify-center">
                            <button
                              onClick={() => moveToCart(item)}
                              className={`text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${item.inStock !== false
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              disabled={item.inStock === false}
                            >
                              <ShoppingCart className="w-3 h-3" />
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-1 flex justify-end">
                          <button
                            className="text-gray-400 hover:text-red-500 transition p-1"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Wishlist Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="text-gray-800 font-medium">{wishlistItems.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Available
                  </span>
                  <span className="text-green-600 font-medium">
                    {wishlistItems.filter(item => item.inStock !== false).length}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total Value</span>
                    <span className="text-xl text-green-600">
                      Rs.{wishlistItems.reduce((acc, item) => acc + (item.price || 0), 0)}
                    </span>
                  </div>
                </div>

                {wishlistItems.filter(item => item.inStock !== false).length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Truck className="w-4 h-4" />
                      <span className="font-medium">Ready to order!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-4 space-y-2">
                <Link
                  to="/cart"
                  className="w-full bg-green-600 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 hover:bg-green-700"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Go to Cart
                </Link>

                <Link
                  to="/products"
                  className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <Heart className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                Save items for later
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                Free delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;