// Header.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Heart,
  Package,
  UserCircle
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { LogoutUser } from "../../features/auth/AuthApi";
import toast from "react-hot-toast";
import { clearMessage } from "../../features/auth/AuthSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, isInitialized, message, error, success, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const cartCount = 3;

  const notifications = [
    { id: 1, title: "Order Delivered", message: "Your order #1234 has been delivered", time: "5 min ago", read: false },
    { id: 2, title: "Special Offer", message: "20% off on fresh vegetables", time: "1 hour ago", read: false },
    { id: 3, title: "New Product Added", message: "Fresh organic apples in stock", time: "2 hours ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    dispatch(LogoutUser());
  }

  const HeaderSkeleton = () => (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="hidden sm:block">
              <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-28 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          </div>

          {/* Navigation Skeleton */}
          <nav className="hidden md:flex items-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </nav>

          {/* Search Bar Skeleton */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="w-full h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Right Icons Skeleton */}
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

  if (!isInitialized) {
    return <HeaderSkeleton />
  }


  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
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
              to="/categories"
              className="text-gray-600 hover:text-green-600 transition text-sm font-medium relative group"
            >
              Categories
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

          <div className="hidden md:flex items-center flex-1 max-w-md bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-green-500 focus-within:shadow-md transition-all duration-300">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fresh products..."
              className="bg-transparent outline-none text-sm ml-2 w-full"
            />
          </div>

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

            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition group"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button className="text-xs text-green-600 hover:text-green-700">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${!notif.read ? "bg-green-50/30" : ""
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${!notif.read ? "bg-green-500" : "bg-gray-300"}`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Link
                      to="/notifications"
                      className="block text-center py-2 text-sm text-green-600 hover:bg-green-50 transition font-medium"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </>
              )}
            </div>

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
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full"
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
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
            <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 mb-4">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm ml-2 w-full"
              />
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
                to="/categories"
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition text-sm font-medium py-2 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
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

      {/* Mobile Menu Animation */}
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