import { useEffect, useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MapPin,
  DollarSign,
  Search,
  ChevronDown,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { getAllOrders, getVendorOrderDetails } from '../features/order/OrderApi';

interface DeliveryPerson {
  id: number;
  name: string;
  phone: string;
  isAvailable: boolean;
}

// Placeholder image as a data URL to avoid infinite loading
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';

const AdminOrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const dispatch = useAppDispatch();
  const { storeOrders, loading, success, error, message, storeOrderDetails } = useAppSelector(state => state.order);

  // Static delivery persons for now
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([
    { id: 1, name: "Ram KC", phone: "9812345678", isAvailable: true },
    { id: 2, name: "Shyam Thapa", phone: "9823456789", isAvailable: true },
    { id: 3, name: "Hari Shrestha", phone: "9834567890", isAvailable: false },
    { id: 4, name: "Gita Rai", phone: "9845678901", isAvailable: true }
  ]);

  // State to track assigned delivery person for each order
  const [orderDeliveryPerson, setOrderDeliveryPerson] = useState<{ [key: number]: DeliveryPerson | null }>({});

  // Calculate stats from storeOrders
  const stats = {
    totalOrders: storeOrders?.length || 0,
    pending: storeOrders?.filter((o: any) => o.status === 'PENDING').length || 0,
    confirmed: storeOrders?.filter((o: any) => o.status === 'CONFIRMED').length || 0,
    processing: storeOrders?.filter((o: any) => o.status === 'SHIPPED').length || 0,
    outForDelivery: storeOrders?.filter((o: any) => o.status === 'SHIPPED').length || 0,
    delivered: storeOrders?.filter((o: any) => o.status === 'DELIVERED').length || 0,
    cancelled: storeOrders?.filter((o: any) => o.status === 'CANCELLED').length || 0,
    totalRevenue: storeOrders?.reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0) || 0
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    toast.success(`Order status updated to ${newStatus}`);
  };

  const assignDeliveryPerson = (orderId: number, deliveryPersonId: number) => {
    const deliveryPerson = deliveryPersons.find(dp => dp.id === deliveryPersonId);
    setOrderDeliveryPerson(prev => ({
      ...prev,
      [orderId]: deliveryPerson || null
    }));
    setShowDeliveryModal(false);
    toast.success('Delivery person assigned successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const options = [
      { value: 'PENDING', label: 'Pending' },
      { value: 'CONFIRMED', label: 'Confirmed' },
      { value: 'SHIPPED', label: 'Shipped' },
      { value: 'DELIVERED', label: 'Delivered' },
      { value: 'CANCELLED', label: 'Cancelled' }
    ];

    if (currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') {
      return options.filter(opt => opt.value === currentStatus);
    }

    return options;
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'ESEWA': return 'Esewa';
      case 'COD': return 'Cash on Delivery';
      case 'CARD': return 'Card Payment';
      default: return method;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const getImageUrl = (productImage: string, productId: number) => {
    if (imageErrors[productId]) {
      return PLACEHOLDER_IMAGE;
    }
    if (productImage && !productImage.startsWith('http')) {
      return `http://localhost:4000${productImage}`;
    }
    return productImage || PLACEHOLDER_IMAGE;
  };

  const filterOrders = () => {
    let filtered = storeOrders ? [...storeOrders] : [];

    // if (searchTerm) {
    //   filtered = filtered.filter((order: any) =>
    //     order.id.toString().includes(searchTerm)
    //   );
    // }

    // if (statusFilter !== 'all') {
    //   filtered = filtered.filter((order: any) => order.status === statusFilter);
    // }

    // if (dateFilter === 'today') {
    //   const today = new Date().toDateString();
    //   filtered = filtered.filter((order: any) => new Date(order.createdAt).toDateString() === today);
    // } else if (dateFilter === 'yesterday') {
    //   const yesterday = new Date();
    //   yesterday.setDate(yesterday.getDate() - 1);
    //   filtered = filtered.filter((order: any) => new Date(order.createdAt).toDateString() === yesterday.toDateString());
    // } else if (dateFilter === 'week') {
    //   const weekAgo = new Date();
    //   weekAgo.setDate(weekAgo.getDate() - 7);
    //   filtered = filtered.filter((order: any) => new Date(order.createdAt) >= weekAgo);
    // } else if (dateFilter === 'month') {
    //   const monthAgo = new Date();
    //   monthAgo.setMonth(monthAgo.getMonth() - 1);
    //   filtered = filtered.filter((order: any) => new Date(order.createdAt) >= monthAgo);
    // }

    return filtered;
  };

  const filteredOrders = filterOrders();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const getOrderDetails = (orderId: number) => {
    dispatch(getVendorOrderDetails(orderId));
    setIsDetailsModalOpen(true);
  }

  if (loading && !storeOrders?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-purple-600">{stats.processing}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">Rs. {parseFloat(stats.totalRevenue.toString()).toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('today');
                setCurrentPage(1);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                      <p className="text-gray-500 mt-1">No orders match your filters</p>
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{order.address}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          Rs. {order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm text-gray-700">{getPaymentMethodLabel(order.paymentMethod)}</span>
                          <br />
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`appearance-none px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer pr-7`}
                          >
                            {getStatusOptions(order.status).map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {orderDeliveryPerson[order.id] ? (
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">{orderDeliveryPerson[order.id]?.name}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDeliveryModal(true);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Assign Delivery
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => getOrderDetails(order.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
                <span className="ml-4">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg border transition text-sm ${currentPage === 1
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500'
                    }`}
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border transition ${currentPage === 1
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500'
                    }`}
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg transition text-sm ${currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'text-gray-600 hover:bg-green-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border transition ${currentPage === totalPages
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500'
                    }`}
                >
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg border transition text-sm ${currentPage === totalPages
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500'
                    }`}
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Delivery Modal */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Assign Delivery Person</h2>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Order #{selectedOrder.id}</p>
                <p className="font-medium text-gray-900">{selectedOrder.address}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {selectedOrder.address}
                </p>
              </div>

              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                onChange={(e) => assignDeliveryPerson(selectedOrder.id, Number(e.target.value))}
                defaultValue=""
              >
                <option value="" disabled>Select delivery person</option>
                {deliveryPersons.filter(dp => dp.isAvailable).map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} - {person.phone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal - Using API Data with Products */}
      {isDetailsModalOpen && storeOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Order Details #{storeOrderDetails.id}</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Order Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                  <p className="font-medium text-gray-900">Order ID: #{storeOrderDetails.id}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Date: {new Date(storeOrderDetails.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Information</h3>
                  <p className="text-sm text-gray-800 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {storeOrderDetails.address}
                  </p>
                  {orderDeliveryPerson[storeOrderDetails.id] && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                      <Truck className="w-3 h-3" />
                      Delivery by: {orderDeliveryPerson[storeOrderDetails.id]?.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Products */}
              {storeOrderDetails.products && storeOrderDetails.products.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {storeOrderDetails.products.map((product: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100">
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={getImageUrl(product.productImage, product.productId)}
                            alt={product.productName}
                            className="w-full h-full object-cover rounded-lg"
                            onError={() => handleImageError(product.productId)}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.productName}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {product.quantity} × Rs. {product.price}
                          </p>
                          <p className="text-xs text-gray-400">
                            Product ID: {product.productId}
                          </p>
                        </div>
                        
                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            Rs. {product.subtotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-green-600">
                    Rs. {storeOrderDetails.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Payment Method</span>
                  <span>{getPaymentMethodLabel(storeOrderDetails.paymentMethod)}</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                  <span>Payment Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(storeOrderDetails.paymentStatus)}`}>
                    {storeOrderDetails.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                  <span>Order Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(storeOrderDetails.status)}`}>
                    {storeOrderDetails.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {!orderDeliveryPerson[storeOrderDetails.id] && 
                 storeOrderDetails.status !== 'DELIVERED' && 
                 storeOrderDetails.status !== 'CANCELLED' && (
                  <button
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setSelectedOrder(storeOrderDetails);
                      setShowDeliveryModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Assign Delivery
                  </button>
                )}
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;