// OrdersPage.tsx
import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  CreditCard,
  Download,
  Star,
  RefreshCw,
  MapPin,
  Phone,
  ChevronRight,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { getAllMyOrders, getOrderDetails } from "../features/order/OrderApi";
import toast from "react-hot-toast";

// Types
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image: string;
  productId: number;
}

interface VendorOrder {
  id: number;
  totalAmount: string;
  farmId: number;
  farmName: string;
  orderItems: OrderItem[];
}

interface TransformedOrder {
  id: number;
  orderId: string;
  date: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  address: string;
  customerPhone: string;
  vendorOrders: VendorOrder[];
}

const OrdersPage = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);

  // Check for mobile view
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

  const dispatch = useAppDispatch();
  const { orders: allOrders, loading, error, message, orderDetails } = useAppSelector((state) => state.order);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    dispatch(getAllMyOrders());
  };

  // Transform API orders to component format
  const transformOrders = (apiOrders: any[]): TransformedOrder[] => {
    if (!apiOrders || apiOrders.length === 0) return [];

    return apiOrders.map((order: any) => ({
      id: order.id,
      orderId: `ORD-${String(order.id).padStart(3, '0')}`,
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : new Date().toLocaleDateString(),
      total: parseFloat(order.totalAmount) || 0,
      status: mapOrderStatus(order.status || 'pending'),
      paymentMethod: order.paymentMethod || 'Cash on Delivery',
      paymentStatus: order.paymentStatus || 'pending',
      address: order.address || 'N/A',
      customerPhone: order.customerPhone || order.user?.phone || 'N/A',
      vendorOrders: order.vendorOrders?.map((vo: any) => ({
        id: vo.id,
        totalAmount: vo.totalAmount,
        farmId: vo.farmId,
        farmName: vo.farm?.farmName || `Farm ${vo.farmId}`,
        orderItems: vo.orderItems?.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          name: item.product?.name || `Product ${item.productId}`,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          subtotal: parseFloat(item.subtotal) || 0,
          image: item.product?.image || null
        })) || []
      })) || []
    }));
  };

  // Transform order details to same format
  const transformOrderDetails = (details: any): TransformedOrder | null => {
    if (!details || !details.id) return null;
    
    return {
      id: details.id,
      orderId: `ORD-${String(details.id).padStart(3, '0')}`,
      date: details.createdAt ? new Date(details.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : new Date().toLocaleDateString(),
      total: parseFloat(details.totalAmount) || 0,
      status: mapOrderStatus(details.status || 'pending'),
      paymentMethod: details.paymentMethod || 'Cash on Delivery',
      paymentStatus: details.paymentStatus || 'pending',
      address: details.address || 'N/A',
      customerPhone: details.customerPhone || 'N/A',
      vendorOrders: details.vendorOrders?.map((vo: any) => ({
        id: vo.id,
        totalAmount: vo.totalAmount,
        farmId: vo.farmId,
        farmName: vo.farm?.farmName || `Farm ${vo.farmId}`,
        orderItems: vo.orderItems?.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          name: item.product?.name || `Product ${item.productId}`,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          subtotal: parseFloat(item.subtotal) || 0,
          image: item.product?.image || null
        })) || []
      })) || []
    };
  };

  const mapOrderStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'pending': 'processing',
      'confirmed': 'processing',
      'processing': 'processing',
      'out_for_delivery': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusMap[status] || 'processing';
  };

  const orders = transformOrders(allOrders);
  
  // Use orderDetails from API when available
  const selectedOrder = selectedOrderId 
    ? (orderDetails?.id === selectedOrderId 
        ? transformOrderDetails(orderDetails) 
        : orders.find((o) => o.id === selectedOrderId))
    : null;

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

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter((o) => o.status === activeTab);

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetails(orderId));
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedOrderId(null);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    setCancellingOrder(orderId);
    try {
      // Add your cancel order API call here
      // await dispatch(cancelOrder(orderId)).unwrap();
      toast.success('Order cancelled successfully');
      fetchOrders();
      setSelectedOrderId(null);
      setShowDetails(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleBuyAgain = (order: TransformedOrder) => {
    const allItems = order.vendorOrders.flatMap(vo => vo.orderItems);
    toast.success(`${allItems.length} items added to cart`);
  };

  const handleTrackOrder = (orderId: number) => {
    toast.success('Tracking feature coming soon');
  };

  const handleDownloadInvoice = (order: TransformedOrder) => {
    toast.success('Invoice download started');
  };

  const handleRateOrder = (orderId: number) => {
    toast.success('Rating feature coming soon');
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{message || 'Failed to load orders'}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Desktop View
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 text-sm">View and manage your orders</p>
          </div>

          <div className="flex gap-6">
            {/* Left Sidebar */}
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
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    const BadgeIcon = badge.icon;
                    const isSelected = selectedOrderId === order.id;
                    const totalItems = order.vendorOrders.flatMap(vo => vo.orderItems).reduce((sum, item) => sum + item.quantity, 0);

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
                            {order.orderId}
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
                  })
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-[60%] bg-white rounded-xl shadow-sm overflow-hidden">
              {selectedOrder ? (
                <OrderDetails 
                  order={selectedOrder} 
                  onCancel={handleCancelOrder}
                  onBuyAgain={handleBuyAgain}
                  onTrack={handleTrackOrder}
                  onDownloadInvoice={handleDownloadInvoice}
                  onRate={handleRateOrder}
                  cancellingOrder={cancellingOrder}
                  isLoading={loading && orderDetails?.id === selectedOrderId}
                />
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

  // Mobile View
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-xs">View and manage your orders</p>
        </div>

        {!showDetails ? (
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
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const BadgeIcon = badge.icon;
                  const totalItems = order.vendorOrders.flatMap(vo => vo.orderItems).reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <button
                      key={order.id}
                      onClick={() => handleSelectOrder(order.id)}
                      className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-green-200 hover:shadow-sm transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-gray-900">{order.orderId}</span>
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
                        <span>{totalItems} items</span>
                        <span className="font-medium text-gray-700">Rs.{order.total}</span>
                      </div>
                      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        Tap to view details
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-green-600 mb-4 p-2 hover:bg-green-50 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
            {selectedOrder && (
              <OrderDetails 
                order={selectedOrder} 
                onCancel={handleCancelOrder}
                onBuyAgain={handleBuyAgain}
                onTrack={handleTrackOrder}
                onDownloadInvoice={handleDownloadInvoice}
                onRate={handleRateOrder}
                cancellingOrder={cancellingOrder}
                isLoading={loading && orderDetails?.id === selectedOrderId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Order Details Component with Fixed Image Handling
const OrderDetails = ({ 
  order, 
  onCancel, 
  onBuyAgain, 
  onTrack, 
  onDownloadInvoice, 
  onRate,
  cancellingOrder,
  isLoading = false
}: {
  order: TransformedOrder;
  onCancel: (orderId: number) => void;
  onBuyAgain: (order: TransformedOrder) => void;
  onTrack: (orderId: number) => void;
  onDownloadInvoice: (order: TransformedOrder) => void;
  onRate: (orderId: number) => void;
  cancellingOrder: number | null;
  isLoading?: boolean;
}) => {
  const badge = (() => {
    switch (order.status) {
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
  })();
  
  const BadgeIcon = badge.icon;
  
  // Track failed images locally to prevent infinite loops
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  
  const allItems = order.vendorOrders.flatMap(vo => vo.orderItems);
  const totalItems = allItems.reduce((sum, item) => sum + item.quantity, 0);
  const calculatedTotal = allItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleImageError = (itemId: number) => {
    setFailedImages(prev => {
      if (prev.has(itemId)) return prev;
      return new Set(prev).add(itemId);
    });
  };

  // Generate SVG placeholder without external API calls
  const getPlaceholderImage = (productName: string) => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af'%3E${encodeURIComponent(productName.slice(0, 10))}%3C/text%3E%3C/svg%3E`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${badge.bg} rounded-full flex items-center justify-center`}>
              <BadgeIcon className={`w-5 h-5 md:w-6 md:h-6 ${badge.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 text-sm md:text-base">{order.orderId}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
                  {badge.text}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {order.date}
                </span>
                <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">Rs.{order.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Vendor Sections */}
        {order.vendorOrders.length > 0 ? (
          order.vendorOrders.map((vendorOrder) => (
            <div key={vendorOrder.id} className="mb-6">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <Package className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-700">{vendorOrder.farmName}</h3>
                <span className="text-xs text-gray-500">Vendor Total: Rs.{parseFloat(vendorOrder.totalAmount).toLocaleString()}</span>
              </div>
              <div className="space-y-3">
                {vendorOrder.orderItems.map((item) => {
                  const imageFailed = failedImages.has(item.id);
                  const imageSrc = imageFailed || !item.image 
                    ? getPlaceholderImage(item.name)
                    : item.image;

                  return (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <img 
                        src={imageSrc}
                        alt={item.name} 
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-xs text-gray-500">Rs.{item.price} each</p>
                      </div>
                      <p className="font-semibold text-gray-800 flex-shrink-0">Rs.{item.subtotal.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No items found in this order
          </div>
        )}

        {/* Payment & Delivery Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Payment</span>
            </div>
            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
            <p className={`text-xs mt-1 ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Delivery</span>
            </div>
            <p className="text-sm text-gray-600 break-words">{order.address}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="break-words">{order.customerPhone}</span>
            </p>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-3 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm text-gray-800">Rs.{calculatedTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Delivery Fee</span>
            <span className="text-sm text-green-600">Free</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Total Paid</span>
              <span className="text-lg font-bold text-green-600">Rs.{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {order.status === "delivered" && (
            <>
              <button 
                onClick={() => onRate(order.id)}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <Star className="w-3 h-3" />
                Rate Products
              </button>
              <button 
                onClick={() => onBuyAgain(order)}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
              >
                <RefreshCw className="w-3 h-3" />
                Buy Again
              </button>
            </>
          )}
          {order.status === "processing" && (
            <button 
              onClick={() => onCancel(order.id)}
              disabled={cancellingOrder === order.id}
              className="flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancellingOrder === order.id ? (
                <Loader className="w-3 h-3 animate-spin" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              Cancel Order
            </button>
          )}
          {(order.status === "processing" || order.status === "shipped") && (
            <button 
              onClick={() => onTrack(order.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
            >
              <Truck className="w-3 h-3" />
              Track Order
            </button>
          )}
          <button 
            onClick={() => onDownloadInvoice(order)}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <Download className="w-3 h-3" />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;