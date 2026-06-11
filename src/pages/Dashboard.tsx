import { useState } from "react";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  CreditCard,
  Truck,
  Star,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Stats data
  const stats = [
    {
      id: 1,
      title: "Total Revenue",
      value: "₹18.4L",
      change: "+18.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-emerald-500",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      id: 2,
      title: "Total Orders",
      value: "1,258",
      change: "+15.3%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: 3,
      title: "Products",
      value: "342",
      change: "+12",
      trend: "up",
      icon: Package,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      id: 4,
      title: "Today's Revenue",
      value: "₹1.84L",
      change: "+28 orders",
      trend: "up",
      icon: Calendar,
      color: "bg-orange-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Revenue Chart
  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Revenue',
        data: [125000, 142000, 138000, 165000, 182000, 178000, 195000, 210000, 225000, 242000, 238000, 275000],
        borderColor: '#10b981',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#f3f4f6',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => ` ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        grid: { color: '#e5e7eb', drawBorder: false },
        ticks: { callback: (val: any) => `₹${val/1000}k`, color: '#6b7280' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280' },
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
  };

  // Weekly Sales Chart
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: 'Sales',
        data: [28500, 31200, 29800, 34600, 42500, 38500, 29200],
        backgroundColor: '#10b981',
        borderRadius: 8,
        barPercentage: 0.65,
        categoryPercentage: 0.8,
      },
    ],
  };

  const weeklyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        callbacks: {
          label: (context: any) => ` ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        grid: { color: '#e5e7eb' },
        ticks: { callback: (val: any) => `₹${val/1000}k`, color: '#6b7280' },
      },
      x: { ticks: { color: '#6b7280' } },
    },
  };

  // Category Pie Chart
  const categoryData = {
    labels: ["Vegetables", "Fruits", "Grains", "Dairy"],
    datasets: [{
      data: [35, 28, 22, 15],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      borderWidth: 0,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { padding: 15, usePointStyle: true } },
      tooltip: { callbacks: { label: (ctx: any) => `${ctx.label}: ${ctx.parsed}%` } },
    },
  };

  // Recent orders
  const recentOrders = [
    { id: "#1001", customer: "Rajesh Kumar", amount: 2500, status: "completed", date: "15 Jan 2024", items: 3 },
    { id: "#1002", customer: "Priya Sharma", amount: 1800, status: "processing", date: "15 Jan 2024", items: 2 },
    { id: "#1003", customer: "Amit Patel", amount: 3500, status: "pending", date: "15 Jan 2024", items: 5 },
    { id: "#1004", customer: "Sneha Reddy", amount: 1200, status: "completed", date: "14 Jan 2024", items: 1 },
    { id: "#1005", customer: "Vikram Singh", amount: 4200, status: "completed", date: "14 Jan 2024", items: 4 },
  ];

  const getStatusStyle = (status: string) => {
    const styles = {
      completed: { bg: "bg-emerald-50", text: "text-emerald-600", icon: CheckCircle },
      processing: { bg: "bg-blue-50", text: "text-blue-600", icon: Clock },
      pending: { bg: "bg-amber-50", text: "text-amber-600", icon: AlertCircle },
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  // Top products
  const topProducts = [
    { name: "Organic Apples", sales: 1250, revenue: 150000, growth: 25 },
    { name: "Basmati Rice", sales: 980, revenue: 176400, growth: 18 },
    { name: "Fresh Spinach", sales: 2100, revenue: 84000, growth: 32 },
    { name: "Organic Honey", sales: 450, revenue: 157500, growth: 42 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's your business overview</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                {(["week", "month", "year"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      timeframe === period
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.id}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <div className={`${stat.bgLight} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Pending Orders</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">45</p>
              </div>
              <Clock className="w-10 h-10 text-blue-500 opacity-75" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium">Completed Orders</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">1,213</p>
              </div>
              <CheckCircle className="w-10 h-10 text-emerald-500 opacity-75" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">Avg. Order Value</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">₹1,465</p>
              </div>
              <CreditCard className="w-10 h-10 text-purple-500 opacity-75" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 text-sm font-medium">Active Customers</p>
                <p className="text-2xl font-bold text-amber-900 mt-1">2,847</p>
              </div>
              <Users className="w-10 h-10 text-amber-500 opacity-75" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-500 mt-0.5">Monthly performance overview</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-600">Revenue</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <Line data={revenueChartData} options={revenueOptions} />
            </div>
          </div>

          {/* Weekly Sales Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Weekly Sales</h3>
                <p className="text-sm text-gray-500 mt-0.5">Last 7 days performance</p>
              </div>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-80">
              <Bar data={weeklyData} options={weeklyOptions} />
            </div>
          </div>
        </div>

        {/* Pie Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
                <p className="text-sm text-gray-500 mt-0.5">Product distribution</p>
              </div>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              <Pie data={categoryData} options={pieOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                <p className="text-sm text-gray-500 mt-0.5">Best selling items</p>
              </div>
              <Star className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-400">#{idx + 1}</span>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">+{product.growth}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1.5">
                    <span>{product.sales.toLocaleString()} units sold</span>
                    <span>{formatCurrency(product.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500 group-hover:bg-emerald-600"
                      style={{ width: `${(product.sales / 2100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500 mt-0.5">Latest transactions from your store</p>
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1 transition-colors">
              View All Orders
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  const StatusIcon = statusStyle.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;