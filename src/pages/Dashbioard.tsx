import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { getDashboardStatic } from "../features/user/userApi";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueChange: 12.5,
    ordersChange: 8.3,
    productsChange: 5.2,
    usersChange: 15.7,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const dispatch = useAppDispatch();
  const { dashboardStatic } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getDashboardStatic());
  }, [dispatch]);

  // Update stats when dashboardStatic changes
  useEffect(() => {
    if (dashboardStatic) {
      setStats(prev => ({
        ...prev,
        totalRevenue: dashboardStatic.totalAmount || 0,
        totalOrders: dashboardStatic.totalOrder || 0,
        totalProducts: dashboardStatic.totalProduct || 0,
        totalUsers: dashboardStatic.totalUser || 0,
      }));

      if (dashboardStatic.recentOrders && dashboardStatic.recentOrders.length > 0) {
        const transformedOrders = dashboardStatic.recentOrders.map((order) => ({
          id: "#" + order.id,
          customer: order.name || "Unknown Customer",
          amount: parseFloat(order.total_amount) || 0,
          status: order.order_status || "Pending",
          date: new Date(order.created_at).toISOString().split('T')[0],
        }));
        setRecentOrders(transformedOrders);
      }

      if (dashboardStatic.topSellingProducts && dashboardStatic.topSellingProducts.length > 0) {
        const transformedProducts = dashboardStatic.topSellingProducts.map((product, index) => ({
          id: product.productId,
          name: `Product ${product.productId}`,
          sales: parseFloat(product.totalSales) || 0,
          revenue: (parseFloat(product.totalSales) || 0) * 50,
          stock: parseInt(product.stock) || 0,
          trend: index % 2 === 0 ? "up" : "down",
        }));
        setTopProducts(transformedProducts);
      }
    }
  }, [dashboardStatic]);

  const statCards = [
    {
      title: "Total Revenue",
      value: `Rs.${stats.totalRevenue.toLocaleString()}`,
      change: `+${stats.revenueChange}%`,
      icon: DollarSign,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `+${stats.ordersChange}%`,
      icon: ShoppingCart,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: `+${stats.productsChange}%`,
      icon: Package,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "up",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.usersChange}%`,
      icon: Users,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "up",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs md:text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-lg">Recent Orders</h2>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">Rs.{order.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">No recent orders found</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-lg">Top Selling Products</h2>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product.id} className="p-4 md:p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${product.trend === "up" ? "bg-green-50" : "bg-red-50"}`}>
                        {product.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <h3 className="font-medium text-gray-800">{product.name}</h3>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Rs.{product.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">Sales: {product.sales}</span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Package className="w-3 h-3" />
                        Stock: {product.stock}
                      </span>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-sm">Details</button>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">No products found</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;