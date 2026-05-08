import { useEffect, useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Search,
  ChevronDown,
  RefreshCw,
  Navigation,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { getAllMyOrders } from '../features/order/OrderApi';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface DeliveryPerson {
  id: number;
  name: string;
  phone: string;
  isAvailable: boolean;
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  deliveryPerson: DeliveryPerson | null;
}

const AdminOrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1001,
      customerName: "Rajesh Hamal",
      customerPhone: "9841234567",
      customerEmail: "rajesh@example.com",
      deliveryAddress: "Baneshwor, Kathmandu",
      total: 2500,
      orderStatus: "pending",
      paymentMethod: "Cash on Delivery",
      createdAt: "2024-01-15T10:30:00",
      items: [
        { name: "Apple", quantity: 2, price: 150 },
        { name: "Banana", quantity: 3, price: 80 }
      ],
      deliveryPerson: null
    },
    {
      id: 1002,
      customerName: "Sita Rana",
      customerPhone: "9851234567",
      customerEmail: "sita@example.com",
      deliveryAddress: "Lalitpur, Patan",
      total: 1800,
      orderStatus: "confirmed",
      paymentMethod: "Cash on Delivery",
      createdAt: "2024-01-15T11:15:00",
      items: [
        { name: "Rice", quantity: 5, price: 300 },
        { name: "Lentils", quantity: 2, price: 150 }
      ],
      deliveryPerson: null
    },
    {
      id: 1003,
      customerName: "Hari Bahadur",
      customerPhone: "9861234567",
      customerEmail: "hari@example.com",
      deliveryAddress: "Thamel, Kathmandu",
      total: 3500,
      orderStatus: "processing",
      paymentMethod: "Cash on Delivery",
      createdAt: "2024-01-15T09:45:00",
      items: [
        { name: "Chicken", quantity: 2, price: 500 },
        { name: "Eggs", quantity: 12, price: 20 }
      ],
      deliveryPerson: null
    },
    {
      id: 1004,
      customerName: "Gita Sharma",
      customerPhone: "9871234567",
      customerEmail: "gita@example.com",
      deliveryAddress: "Boudha, Kathmandu",
      total: 4200,
      orderStatus: "out_for_delivery",
      paymentMethod: "Cash on Delivery",
      createdAt: "2024-01-14T14:20:00",
      items: [
        { name: "Pizza", quantity: 1, price: 800 },
        { name: "Burger", quantity: 2, price: 250 }
      ],
      deliveryPerson: { id: 1, name: "Ram KC", phone: "9812345678", isAvailable: true }
    },
    {
      id: 1005,
      customerName: "Krishna Prasad",
      customerPhone: "9881234567",
      customerEmail: "krishna@example.com",
      deliveryAddress: "Bhaktapur",
      total: 5800,
      orderStatus: "delivered",
      paymentMethod: "Cash on Delivery",
      createdAt: "2024-01-14T08:00:00",
      items: [
        { name: "Milk", quantity: 5, price: 100 },
        { name: "Butter", quantity: 2, price: 150 }
      ],
      deliveryPerson: { id: 2, name: "Shyam Thapa", phone: "9823456789", isAvailable: true }
    },
    {
      id: 1006,
      customerName: "Laxmi Timilsina",
      customerPhone: "9891234567",
      customerEmail: "laxmi@example.com",
      deliveryAddress: "Kirtipur, Kathmandu",
      total: 1200,
      orderStatus: "cancelled",
      paymentMethod: "Cash on Delivery",
      createdAt: "2024-01-13T16:30:00",
      items: [
        { name: "Bread", quantity: 3, price: 80 },
        { name: "Jam", quantity: 1, price: 120 }
      ],
      deliveryPerson: null
    }
  ]);

  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([
    { id: 1, name: "Ram KC", phone: "9812345678", isAvailable: true },
    { id: 2, name: "Shyam Thapa", phone: "9823456789", isAvailable: true },
    { id: 3, name: "Hari Shrestha", phone: "9834567890", isAvailable: false },
    { id: 4, name: "Gita Rai", phone: "9845678901", isAvailable: true }
  ]);

  const [stats, setStats] = useState({
    totalOrders: 6,
    pending: 1,
    confirmed: 1,
    processing: 1,
    outForDelivery: 1,
    delivered: 1,
    cancelled: 1,
    totalRevenue: 19000
  });

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, orderStatus: newStatus } : order
    );
    setOrders(updatedOrders);

    const newStats = {
      totalOrders: updatedOrders.length,
      pending: updatedOrders.filter(o => o.orderStatus === 'pending').length,
      confirmed: updatedOrders.filter(o => o.orderStatus === 'confirmed').length,
      processing: updatedOrders.filter(o => o.orderStatus === 'processing').length,
      outForDelivery: updatedOrders.filter(o => o.orderStatus === 'out_for_delivery').length,
      delivered: updatedOrders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: updatedOrders.filter(o => o.orderStatus === 'cancelled').length,
      totalRevenue: updatedOrders.reduce((sum, o) => sum + o.total, 0)
    };
    setStats(newStats);

    toast.success(`Order status updated to ${newStatus}`);
  };

  const assignDeliveryPerson = (orderId: number, deliveryPersonId: number) => {
    const deliveryPerson = deliveryPersons.find(dp => dp.id === deliveryPersonId);
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, deliveryPerson: deliveryPerson || null, orderStatus: 'out_for_delivery' }
        : order
    );
    setOrders(updatedOrders);
    setShowDeliveryModal(false);

    const newStats = {
      ...stats,
      outForDelivery: stats.outForDelivery + 1,
      processing: stats.processing - 1
    };
    setStats(newStats);

    toast.success('Delivery person assigned successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const options = [
      { value: 'pending', label: 'Pending' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'processing', label: 'Processing' },
      { value: 'out_for_delivery', label: 'Out for Delivery' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' }
    ];

    if (currentStatus === 'delivered' || currentStatus === 'cancelled') {
      return options.filter(opt => opt.value === currentStatus);
    }

    return options;
  };

  const filterOrders = (): Order[] => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      filtered = filtered.filter(order => new Date(order.createdAt).toDateString() === today);
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      filtered = filtered.filter(order => new Date(order.createdAt).toDateString() === yesterday.toDateString());
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(order => new Date(order.createdAt) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(order => new Date(order.createdAt) >= monthAgo);
    }

    return filtered;
  };

  const filteredOrders = filterOrders();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </div>

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
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-purple-600">{stats.processing}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out for Delivery</p>
                <p className="text-2xl font-bold text-orange-600">{stats.outForDelivery}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-600" />
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
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">Rs. {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order ID or customer..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
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
                    <td colSpan={7} className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                      <p className="text-gray-500 mt-1">No orders match your filters</p>
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerPhone}</p>
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
                          Rs. {order.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`appearance-none px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)} focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer pr-7`}
                          >
                            {getStatusOptions(order.orderStatus).map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {order.deliveryPerson ? (
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">{order.deliveryPerson.name}</span>
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
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.orderStatus === 'out_for_delivery' && (
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Track Delivery"
                            >
                              <Navigation className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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
                <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {selectedOrder.deliveryAddress}
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

      {selectedOrder && !showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Order Details #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                  <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" />
                    {selectedOrder.customerPhone}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" />
                    {selectedOrder.customerEmail}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Information</h3>
                  <p className="text-sm text-gray-800 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {selectedOrder.deliveryAddress}
                  </p>
                  {selectedOrder.deliveryPerson && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                      <Truck className="w-3 h-3" />
                      Delivery by: {selectedOrder.deliveryPerson.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">Rs. {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-green-600">Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Payment Method</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                  <span>Order Date</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {!selectedOrder.deliveryPerson && selectedOrder.orderStatus !== 'delivered' && selectedOrder.orderStatus !== 'cancelled' && (
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setShowDeliveryModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Assign Delivery
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
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