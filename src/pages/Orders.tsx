// OrdersPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Calendar,
  CreditCard,
  Download,
  Star,
  RefreshCw,
  MapPin,
  Phone,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const OrdersPage = () => {
  const [selectedOrderId, setSelectedOrderId] = useState("ORD-001");
  const [activeTab, setActiveTab] = useState("all");
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowDetails(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const orders = [
    {
      id: "ORD-001",
      date: "Mar 15, 2024",
      total: 1240,
      status: "delivered",
      paymentMethod: "Cash on Delivery",
      items: [
        { name: "Organic Himalayan Apples", price: 180, quantity: 2, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100" },
        { name: "Fresh Farm Tomatoes", price: 60, quantity: 3, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa2a7?w=100" },
        { name: "Organic Broccoli", price: 120, quantity: 1, image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=100" },
      ],
      address: { street: "123 Main Street", area: "Traffic Chowk", city: "Butwal", phone: "9800000000" },
    },
    {
      id: "ORD-002",
      date: "Mar 10, 2024",
      total: 890,
      status: "shipped",
      paymentMethod: "Khalti",
      items: [
        { name: "Fresh Carrots", price: 50, quantity: 5, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100" },
        { name: "Green Capsicum", price: 80, quantity: 3, image: "https://images.unsplash.com/photo-1563565375005-074f3b8e2c4b?w=100" },
      ],
      address: { street: "45 Shanti Path", area: "Shanti Nagar", city: "Butwal", phone: "9812345678" },
    },
    {
      id: "ORD-003",
      date: "Mar 5, 2024",
      total: 560,
      status: "processing",
      paymentMethod: "eSewa",
      items: [
        { name: "Fresh Spinach", price: 40, quantity: 4, image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=100" },
        { name: "Organic Cauliflower", price: 90, quantity: 2, image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=100" },
      ],
      address: { street: "78 Devnagar Road", area: "Devnagar", city: "Butwal", phone: "9823456789" },
    },
    {
      id: "ORD-004",
      date: "Feb 28, 2024",
      total: 2150,
      status: "cancelled",
      paymentMethod: "Cash on Delivery",
      items: [
        { name: "Organic Apple Pack", price: 450, quantity: 2, image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=100" },
        { name: "Fresh Orange", price: 120, quantity: 5, image: "https://images.unsplash.com/photo-1547514701-4278210176e1?w=100" },
      ],
      address: { street: "12 Golpark Area", area: "Golpark", city: "Butwal", phone: "9834567890" },
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return { icon: CheckCircle, text: "Delivered", color: "text-green-600", bg: "bg-green-50" };
      case "shipped":
        return { icon: Truck, text: "Shipped", color: "text-blue-600", bg: "bg-blue-50" };
      case "processing":
        return { icon: Clock, text: "Processing", color: "text-yellow-600", bg: "bg-yellow-50" };
      case "cancelled":
        return { icon: XCircle, text: "Cancelled", color: "text-red-600", bg: "bg-red-50" };
      default:
        return { icon: Package, text: "Pending", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const filteredOrders = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const selectedBadge = selectedOrder ? getStatusBadge(selectedOrder.status) : null;

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  // Desktop View - Two Columns (40% / 60%)
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 text-sm">View and manage your orders</p>
          </div>

          <div className="flex gap-6">
            {/* Left Sidebar - 40% */}
            <div className="w-[40%] flex-shrink-0">
              <div className="flex gap-1 mb-4 border-b border-gray-200 overflow-x-auto">
                {[
                  { id: "all", label: "All", count: orders.length },
                  { id: "processing", label: "Processing", count: orders.filter((o) => o.status === "processing").length },
                  { id: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
                  { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
                  { id: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 text-sm font-medium transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const BadgeIcon = badge.icon;
                  const isSelected = selectedOrderId === order.id;

                  return (
                    <button
                      key={order.id}
                      onClick={() => handleSelectOrder(order.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        isSelected
                          ? "bg-green-50 border border-green-200 shadow-sm"
                          : "bg-white border border-gray-200 hover:border-green-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold text-sm ${isSelected ? "text-green-700" : "text-gray-900"}`}>
                          {order.id}
                        </span>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${badge.bg}`}>
                          <BadgeIcon className={`w-3 h-3 ${badge.color}`} />
                          <span className={`text-xs ${badge.color}`}>{badge.text}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {order.date}
                        </span>
                        <span>{order.items.length} items</span>
                        <span className="font-medium text-gray-700">Rs.{order.total}</span>
                      </div>
                      {isSelected && (
                        <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          View Details
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - 60% */}
            <div className="w-[60%] bg-white rounded-xl shadow-sm overflow-hidden">
              {selectedOrder && selectedBadge ? (
                <OrderDetails order={selectedOrder} badge={selectedBadge} />
              ) : (
                <div className="p-8 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile View - Show List or Details
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-xs">View and manage your orders</p>
        </div>

        {!showDetails ? (
          // Order List View
          <>
            <div className="flex gap-1 mb-4 border-b border-gray-200 overflow-x-auto">
              {[
                { id: "all", label: "All", count: orders.length },
                { id: "processing", label: "Processing", count: orders.filter((o) => o.status === "processing").length },
                { id: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
                { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
                { id: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const BadgeIcon = badge.icon;

                return (
                  <button
                    key={order.id}
                    onClick={() => handleSelectOrder(order.id)}
                    className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-green-200 hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-900">{order.id}</span>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${badge.bg}`}>
                        <BadgeIcon className={`w-3 h-3 ${badge.color}`} />
                        <span className={`text-xs ${badge.color}`}>{badge.text}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {order.date}
                      </span>
                      <span>{order.items.length} items</span>
                      <span className="font-medium text-gray-700">Rs.{order.total}</span>
                    </div>
                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />
                      Tap to view details
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // Order Details View
          <div>
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-green-600 mb-4 p-2 hover:bg-green-50 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
            {selectedOrder && selectedBadge && (
              <OrderDetails order={selectedOrder} badge={selectedBadge} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Order Details Component
const OrderDetails = ({ order, badge }: { order: any; badge: any }) => {
  const BadgeIcon = badge.icon;

  return (
    <div>
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${badge.bg} rounded-full flex items-center justify-center`}>
              <BadgeIcon className={`w-5 h-5 md:w-6 md:h-6 ${badge.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 text-sm md:text-base">{order.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
                  {badge.text}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {order.date}
                </span>
                <span>{order.items.length} items</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">Rs.{order.total}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-800">Rs.{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Payment</span>
            </div>
            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Delivery</span>
            </div>
            <p className="text-sm text-gray-600">{order.address.street}</p>
            <p className="text-sm text-gray-600">{order.address.area}, {order.address.city}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3" />
              {order.address.phone}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm text-gray-800">Rs.{order.total}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Delivery Fee</span>
            <span className="text-sm text-green-600">Free</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Total Paid</span>
              <span className="text-lg font-bold text-green-600">Rs.{order.total}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {order.status === "delivered" && (
            <>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
                <Star className="w-3 h-3" />
                Rate
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition">
                <RefreshCw className="w-3 h-3" />
                Buy Again
              </button>
            </>
          )}
          {order.status === "processing" && (
            <button className="flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition">
              <XCircle className="w-3 h-3" />
              Cancel
            </button>
          )}
          {(order.status === "processing" || order.status === "shipped") && (
            <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition">
              <Truck className="w-3 h-3" />
              Track
            </button>
          )}
          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
            <Download className="w-3 h-3" />
            Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;