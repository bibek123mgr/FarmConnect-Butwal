// Header.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  Heart,
  Package,
  UserCircle,
  Store
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { LogoutUser } from "../../features/auth/AuthApi";
import toast from "react-hot-toast";
import { clearMessage } from "../../features/auth/AuthSlice";
import axios from "axios";

// Define types - CORRECTED for your API response
interface SearchSuggestion {
  id?: string;
  name: string;
  category?: string;
  price?: number;
  image?: string;
  distance?: number;
}

interface SearchProduct {
  id: number;
  name: string;
  image: string;
  distance: number;
}

interface SearchResponse {
  success: boolean;
  data: SearchProduct[];
}

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, isInitialized, message, error, success, loading } = useAppSelector((state) => state.auth);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [didYouMean, setDidYouMean] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = 0;
  const wishlistCount = 0;

  const notifications = [
    { id: 1, title: "Order Delivered", message: "Your order #1234 has been delivered", time: "5 min ago", read: false },
    { id: 2, title: "Special Offer", message: "20% off on fresh vegetables", time: "1 hour ago", read: false },
    { id: 3, title: "New Product Added", message: "Fresh organic apples in stock", time: "2 hours ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    dispatch(LogoutUser());
    setIsProfileOpen(false);
    toast.success("Logged out successfully");
  };

  // Search autocomplete function - CORRECTED
  const fetchSearchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setDidYouMean([]);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const API_URL = 'http://localhost:3000';
      const response = await axios.get<SearchResponse>(`${API_URL}/api/products/autocorrect-search`, {
        params: { keyword: query }
      });

      if (response.data.success && response.data.data) {
        // Your API returns products directly in data array
        const products = response.data.data;

        // Set suggestions
        setSearchSuggestions(products.map(p => ({
          id: p.id.toString(),
          name: p.name,
          image: p.image,
          distance: p.distance
        })));

        // Add "Did you mean?" suggestions based on distance threshold
        const exactMatches = products.filter(p => p.distance === 0);
        if (exactMatches.length === 0 && products.length > 0) {
          // Suggest the closest match (lowest distance)
          const closestMatch = products.reduce((prev, curr) =>
            prev.distance < curr.distance ? prev : curr
          );
          setDidYouMean([closestMatch.name]);
        } else {
          setDidYouMean([]);
        }

        setIsSearchOpen(true);
      } else {
        setSearchSuggestions([]);
        setDidYouMean([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchSuggestions([]);
      setDidYouMean([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search input handler
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Set new timeout for debouncing
    searchDebounceRef.current = setTimeout(() => {
      fetchSearchSuggestions(value);
    }, 300);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchSuggestions([]);
      setDidYouMean([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion | string) => {
    if (typeof suggestion === 'string') {
      setSearchQuery(suggestion);
      navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    } else {
      setSearchQuery(suggestion.name);
      if (suggestion.id) {
        navigate(`/product/${suggestion.id}`);
      } else {
        navigate(`/products?search=${encodeURIComponent(suggestion.name)}`);
      }
    }
    setIsSearchOpen(false);
    setSearchSuggestions([]);
    setDidYouMean([]);
  };

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Handle auth messages
  useEffect(() => {
    if (!loading && message) {
      if (error) {
        toast.error(message);
      } else if (success) {
        toast.success(message);
      }
      dispatch(clearMessage());
    }
  }, [loading, message, error, success, dispatch]);

  const HeaderSkeleton = () => (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="hidden sm:block">
              <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-28 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </nav>
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="w-full h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-9 bg-gray-200 rounded-full animate-pulse hidden sm:block"></div>
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse md:hidden"></div>
          </div>
        </div>
      </div>
    </header>
  );

  if (!isInitialized) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                FarmeConnect <span className="text-green-600">Butwal</span>
              </h1>
              <p className="text-[10px] text-gray-400 leading-tight">
                Agro Marketplace
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/products"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Desktop Search with Autocomplete */}
          <div className="hidden md:flex items-center flex-1 max-w-md relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-green-500 focus-within:shadow-md transition-all duration-300 flex items-center">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => (searchQuery.trim() && (searchSuggestions.length > 0 || didYouMean.length > 0)) && setIsSearchOpen(true)}
                  placeholder="Search fresh products..."
                  className="bg-transparent outline-none text-sm ml-2 w-full"
                  autoComplete="off"
                />
                {isSearching && (
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin ml-2"></div>
                )}
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {isSearchOpen && (searchSuggestions.length > 0 || didYouMean.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden max-h-96 overflow-y-auto">
                <div className="py-2">
                  {/* Suggested Products Section */}
                  {searchSuggestions.length > 0 && (
                    <>
                      <div className="px-4 py-2 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Suggested Products</p>
                      </div>
                      {searchSuggestions.map((product, index) => (
                        <button
                          key={product.id || index}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full text-left px-4 py-2 hover:bg-green-50 transition flex items-center gap-3"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-700 font-medium">{product.name}</p>

                            </div>
                            {product.category && (
                              <p className="text-xs text-gray-500">{product.category}</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Did You Mean Section */}
                  {didYouMean.length > 0 && (
                    <>
                      {searchSuggestions.length > 0 && <div className="border-t border-gray-100 mt-2"></div>}
                      <div className="px-4 py-2 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Did you mean?</p>
                      </div>
                      {didYouMean.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-green-50 transition flex items-center gap-3"
                        >
                          <Search className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">{suggestion}</span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* View All Results Button */}
                  <div className="border-t border-gray-100 mt-2">
                    <button
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition font-medium"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* No Results Found */}
            {isSearchOpen && searchQuery.trim() && searchSuggestions.length === 0 && didYouMean.length === 0 && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No products found for "{searchQuery}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try searching with different keywords</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-green-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-gray-100 rounded-full transition group"
            >
              <Heart className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-green-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full transition border border-green-200"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserCircle className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </Link>
                        {
                          user.role === "user" &&
                          <Link
                            to="/register-seller"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Store className="w-4 h-4" />
                            Become a Seller
                          </Link>
                        }
                        {/* <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link> */}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 text-green-600 hover:bg-green-50 px-4 py-1.5 rounded-lg transition text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-1.5 rounded-lg transition text-sm font-medium shadow-sm"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 animate-slide-down">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-green-500 transition-all duration-300">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    placeholder="Search products..."
                    className="bg-transparent outline-none text-sm ml-2 w-full"
                    autoComplete="off"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition text-sm font-medium py-2 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition text-sm font-medium py-2 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition text-sm font-medium py-2 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition text-sm font-medium py-2 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            {!user && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <Link
                  to="/login"
                  className="flex-1 text-center border border-green-600 text-green-600 text-sm font-medium py-2 rounded-lg hover:bg-green-50 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-medium py-2 rounded-lg shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;