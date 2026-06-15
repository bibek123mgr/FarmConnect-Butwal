import { useEffect, useState } from "react";
import {
  BarChart3,
  PieChart as PieChartIcon,
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
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { getDashBoardData } from "../features/dashboard/DashbaordApi";

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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getDashBoardData());
  }, [dispatch]);

  const { dashboardStatic } = useAppSelector((state) => state.dashboard);

   const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount || 0);
  };

  // Stats data from dynamic data
  const stats = [
    {
      id: 1,
      title: "Total Revenue",
      value: formatCurrency(dashboardStatic?.totalAmount || 0),
      trend: "up",
      color: "bg-emerald-500",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      id: 2,
      title: "Total Orders",
      value: dashboardStatic?.totalOrders?.toLocaleString() || "0",
      trend: "up",
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: 3,
      title: "Products",
      value: dashboardStatic?.totalProducts?.toLocaleString() || "0",
      trend: "up",
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      id: 4,
      title: "Total Payment",
      value: formatCurrency(dashboardStatic?.totalPayment || 0),
      trend: "up",
      color: "bg-orange-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  // Revenue Chart (Monthly Sales) - using dynamic data
  const revenueChartData = {
    labels: dashboardStatic?.monthlySales?.map((item: any) => item.month) || 
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Revenue',
        data: dashboardStatic?.monthlySales?.map((item: any) => item.sales) || 
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        ticks: { 
          callback: (val: any) => `Rs.${val / 1000}k`, 
          color: '#6b7280' 
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280' },
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
  };

  // Weekly Sales Chart (Daily Sales) - using dynamic data
  const weeklyData = {
    labels: dashboardStatic?.dailySales?.map((item: any) => item.day) || 
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: 'Sales',
        data: dashboardStatic?.dailySales?.map((item: any) => item.sales) || 
               [0, 0, 0, 0, 0, 0, 0],
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
        ticks: { 
          callback: (val: any) => `Rs.${val / 1000}k`, 
          color: '#6b7280' 
        },
      },
      x: { ticks: { color: '#6b7280' } },
    },
  };

  // Category Pie Chart - using dynamic data
  const categoryData = {
    labels: dashboardStatic?.categorySales?.map((item: any) => item.categoryName) || [],
    datasets: [{
      data: dashboardStatic?.categorySales?.map((item: any) => parseInt(item.totalSold)) || [],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
      borderWidth: 0,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { padding: 15, usePointStyle: true } },
      tooltip: { 
        callbacks: { 
          label: (ctx: any) => {
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((ctx.parsed / total) * 100).toFixed(1);
            return `${ctx.label}: ${ctx.parsed} units (${percentage}%)`;
          }
        } 
      },
    },
  };

  // Top products - using dynamic data
  const topProducts = dashboardStatic?.topSellingProducts?.map((product: any, index: number) => ({
    name: product.product?.name || product.productName || `Product ${index + 1}`,
    sales: parseFloat(product.totalSold) || 0,
    revenue: parseFloat(product.totalRevenue) || 0,
    growth: Math.floor(Math.random() * 50) + 10, // Random growth for demo (you can modify this logic)
  })) || [];

  // Calculate max sales for progress bar width
  const maxSales = Math.max(...topProducts.map((p: any) => p.sales), 1);

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
              <div className="mt-4">
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
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
              {categoryData.labels.length > 0 ? (
                <Pie data={categoryData} options={pieOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No category data available
                </div>
              )}
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
              {topProducts.length > 0 ? (
                topProducts.map((product: any, idx: number) => (
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
                        style={{ width: `${(product.sales / maxSales) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No product data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;