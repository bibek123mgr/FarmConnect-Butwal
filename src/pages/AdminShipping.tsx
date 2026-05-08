import { useState, useEffect } from "react";
import {
  Truck,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Package,
  User,
  Download,
  RefreshCw,
  ChevronDown,
  MoreVertical,
  Edit2,
  Printer,
} from "lucide-react";

// Types
interface ShippingOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  orderDate: string;
  shippingDate?: string;
  deliveryDate?: string;
  status: "pending" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "returned";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  trackingNumber?: string;
  courierPartner?: string;
  totalAmount: number;
  shippingCost: number;
  notes?: string;
}

// Mock Data
const mockShippingOrders: ShippingOrder[] = [
  {
    id: "SHP001",
    orderId: "ORD001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+91 9876543210",
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    products: [
      { id: 1, name: "Organic Apples", quantity: 2, price: 1250 },
      { id: 2, name: "Fresh Milk", quantity: 1, price: 890 },
    ],
    orderDate: "2024-01-15T10:30:00Z",
    shippingDate: "2024-01-16T09:00:00Z",
    status: "shipped",
    paymentStatus: "paid",
    trackingNumber: "TRK123456789",
    courierPartner: "BlueDart",
    totalAmount: 2140,
    shippingCost: 50,
  },
  {
    id: "SHP002",
    orderId: "ORD002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+91 9876543211",
    address: {
      street: "456 Park Avenue",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    products: [
      { id: 3, name: "Whole Wheat Bread", quantity: 3, price: 780 },
    ],
    orderDate: "2024-01-16T14:20:00Z",
    status: "processing",
    paymentStatus: "paid",
    totalAmount: 2340,
    shippingCost: 40,
  },
  {
    id: "SHP003",
    orderId: "ORD003",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    customerPhone: "+91 9876543212",
    address: {
      street: "789 Lake View",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    products: [
      { id: 4, name: "Free Range Eggs", quantity: 2, price: 670 },
      { id: 5, name: "Organic Honey", quantity: 1, price: 490 },
    ],
    orderDate: "2024-01-14T09:15:00Z",
    shippingDate: "2024-01-15T11:00:00Z",
    deliveryDate: "2024-01-17T15:30:00Z",
    status: "delivered",
    paymentStatus: "paid",
    trackingNumber: "TRK987654321",
    courierPartner: "DTDC",
    totalAmount: 1830,
    shippingCost: 60,
  },
];

const AdminShipping = () => {
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ShippingOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierPartner, setCourierPartner] = useState("");

  useEffect(() => {
    // Fetch shipping orders from API
    setShippingOrders(mockShippingOrders);
    setFilteredOrders(mockShippingOrders);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, shippingOrders]);

  const filterOrders = () => {
    let filtered = shippingOrders;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: ShippingOrder["status"]) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
      processing: { color: "bg-blue-100 text-blue-800", icon: RefreshCw, label: "Processing" },
      shipped: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
      out_for_delivery: { color: "bg-orange-100 text-orange-800", icon: Truck, label: "Out for Delivery" },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" },
      returned: { color: "bg-gray-100 text-gray-800", icon: RefreshCw, label: "Returned" },
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: ShippingOrder["paymentStatus"]) => {
    const statusConfig = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewDetails = (order: ShippingOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdateStatus = (order: ShippingOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setCourierPartner(order.courierPartner || "");
    setShowUpdateStatus(true);
  };

  const handleStatusUpdateSubmit = () => {
    if (selectedOrder) {
      const updatedOrders = shippingOrders.map(order =>
        order.id === selectedOrder.id
          ? { 
              ...order, 
              status: newStatus as ShippingOrder["status"],
              trackingNumber: trackingNumber || order.trackingNumber,
              courierPartner: courierPartner || order.courierPartner,
              shippingDate: newStatus === "shipped" && !order.shippingDate ? new Date().toISOString() : order.shippingDate,
              deliveryDate: newStatus === "delivered" ? new Date().toISOString() : order.deliveryDate,
            }
          : order
      );
      setShippingOrders(updatedOrders);
      setShowUpdateStatus(false);
      setSelectedOrder(null);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`);
    // Implement bulk actions like print shipping labels, generate invoices, etc.
  };

  const stats = {
    total: shippingOrders.length,
    pending: shippingOrders.filter(o => o.status === "pending").length,
    shipped: shippingOrders.filter(o => o.status === "shipped").length,
    delivered: shippingOrders.filter(o => o.status === "delivered").length,
    outForDelivery: shippingOrders.filter(o => o.status === "out_for_delivery").length,
    processing: shippingOrders.filter(o => o.status === "processing").length,
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shipping Management</h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Track and manage all shipments in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Out for Delivery</p>
              <p className="text-2xl font-bold text-orange-600">{stats.outForDelivery}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Bulk Print
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{order.orderId}</p>
                      <p className="text-xs text-gray-500">{order.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                  <td className="px-4 py-3">{getPaymentStatusBadge(order.paymentStatus)}</td>
                  <td className="px-4 py-3">
                    {order.trackingNumber ? (
                      <div>
                        <p className="text-sm text-gray-800">{order.trackingNumber}</p>
                        <p className="text-xs text-gray-500">{order.courierPartner}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">₹{order.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                        title="Update Status"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded transition"
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No shipping orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Order Details - {selectedOrder.orderId}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p className="text-sm"><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    <p className="text-sm"><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.address.street}</p>
                    <p>{selectedOrder.address.city}, {selectedOrder.address.state}</p>
                    <p>{selectedOrder.address.pincode}</p>
                    <p>{selectedOrder.address.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-gray-500">{new Date(selectedOrder.orderDate).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedOrder.shippingDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Shipped</p>
                        <p className="text-xs text-gray-500">{new Date(selectedOrder.shippingDate).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.deliveryDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Delivered</p>
                        <p className="text-xs text-gray-500">{new Date(selectedOrder.deliveryDate).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Products
                </h3>
                <div className="space-y-3">
                  {selectedOrder.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">Quantity: {product.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{(product.price * product.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="pt-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{(selectedOrder.totalAmount - selectedOrder.shippingCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>₹{selectedOrder.shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleUpdateStatus(selectedOrder);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateStatus && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b p-4">
              <h2 className="text-xl font-bold text-gray-800">Update Shipping Status</h2>
              <p className="text-sm text-gray-500">Order: {selectedOrder.orderId}</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
              {(newStatus === "shipped" || newStatus === "out_for_delivery") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Courier Partner</label>
                    <input
                      type="text"
                      value={courierPartner}
                      onChange={(e) => setCourierPartner(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., BlueDart, DTDC, FedEx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter tracking number"
                    />
                  </div>
                </>
              )}
              {newStatus === "delivered" && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">Order will be marked as delivered. Customer will be notified.</p>
                </div>
              )}
              {newStatus === "cancelled" && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-800">Order will be cancelled. Customer will be notified and refund will be processed if applicable.</p>
                </div>
              )}
            </div>
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowUpdateStatus(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdateSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipping;