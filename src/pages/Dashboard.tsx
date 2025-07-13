import { Film, User, Ticket, TrendingUp, Calendar, MoreHorizontal, Star, ChevronRight, Activity, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import ServiceApi from "../services/api";
import { useNavigate } from "react-router-dom";
import formatMoney from "../types/format-money";

// Dashboard data interfaces
interface DashboardData {
  overview: {
    totalMovies: { count: number; growth: number; thisMonth: number };
    totalUsers: { count: number; growth: number; thisMonth: number };
    totalBookings: { count: number; growth: number; thisMonth: number };
    totalRevenue: { amount: number; growth: number; thisMonth: number };
  };
  charts: {
    revenueByMonth: Array<{ month: string; revenue: number }>;
    bookingsByStatus: Array<{ status: string; count: number }>;
    usersByRole: Array<{ role: string; count: number }>;
  };
  recentBookings: Array<{
    id: number;
    bookingCode: string;
    customerName: string;
    movieTitle: string;
    theaterName: string;
    totalPrice: number;
    status: string;
    bookingDate: string;
  }>;
  topMovies: Array<{
    id: number;
    title: string;
    posterPath: string;
    rating: number;
    bookingCount: number;
  }>;
  topTheaters: Array<{
    id: number;
    name: string;
    location: string;
    bookingCount: number;
  }>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch main dashboard data
      const response = await ServiceApi.get('/dashboard');
      setDashboardData(response.data.data);

      console.log('Dashboard data:', response.data.data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick actions
  const quickActions = [
    { label: "Thêm phim mới", icon: <Film size={16} className="text-blue-500" />, color: "blue" , to: "/movies" },
    { label: "Thêm người dùng", icon: <User size={16} className="text-green-500" />, color: "green", to: "/users" },
    { label: "Xem báo cáo", icon: <Activity size={16} className="text-purple-500" />, color: "purple", to: "/bookings" },
    { label: "Quản lý đặt vé", icon: <Ticket size={16} className="text-yellow-500" />, color: "yellow" , to: "/bookings" },
  ];

  // Generate stats array from API data
  const stats = dashboardData ? [
    {
      label: "Phim",
      value: dashboardData.overview.totalMovies.count,
      icon: <Film size={20} className="text-blue-500" />,
      trend: `${dashboardData.overview.totalMovies.growth >= 0 ? '+' : ''}${dashboardData.overview.totalMovies.growth}%`,
      trendUp: dashboardData.overview.totalMovies.growth >= 0,
      color: "blue"
    },
    {
      label: "Người dùng",
      value: dashboardData.overview.totalUsers.count,
      icon: <User size={20} className="text-green-500" />,
      trend: `${dashboardData.overview.totalUsers.growth >= 0 ? '+' : ''}${dashboardData.overview.totalUsers.growth}%`,
      trendUp: dashboardData.overview.totalUsers.growth >= 0,
      color: "green"
    },
    {
      label: "Vé đặt",
      value: dashboardData.overview.totalBookings.count,
      icon: <Ticket size={20} className="text-yellow-500" />,
      trend: `${dashboardData.overview.totalBookings.growth >= 0 ? '+' : ''}${dashboardData.overview.totalBookings.growth}%`,
      trendUp: dashboardData.overview.totalBookings.growth >= 0,
      color: "yellow"
    },
    {
      label: "Rạp",
      value: dashboardData.topTheaters.length,
      icon: <Activity size={20} className="text-orange-500" />,
      trend: "0%",
      trendUp: true,
      color: "orange"
    },
    {
      label: "Doanh thu",
      value: `${formatMoney(dashboardData.overview.totalRevenue.amount)}`,
      icon: <DollarSign size={20} className="text-purple-500" />,
      trend: `${dashboardData.overview.totalRevenue.growth >= 0 ? '+' : ''}${dashboardData.overview.totalRevenue.growth}%`,
      trendUp: dashboardData.overview.totalRevenue.growth >= 0,
      color: "purple"
    },
    
  ] : [];

  if (loading) {
    return (
      <div className="animate-fadeIn space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeIn space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading dashboard: {error}</p>
            <button
              onClick={fetchDashboardData}
              className="btn btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tổng quan về hoạt động của hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary btn-md hover-lift">
            <Calendar size={16} className="mr-2" />
            Báo cáo tháng
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-5 rounded-xl mb-8">
        <h2 className="text-lg font-semibold mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.to)}
              className={`p-4 rounded-xl bg-${action.color}-50 dark:bg-${action.color}-900/20 border border-${action.color}-200 dark:border-${action.color}-800/30 hover:shadow-md transition-all flex items-center justify-between hover-lift`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 mr-3`}>
                  {action.icon}
                </div>
                <span className="font-medium text-sm">{action.label}</span>
              </div>
              <ChevronRight size={16} className={`text-${action.color}-500`} />
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card p-6 hover-lift"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg bg-${stat.color}-100/70 dark:bg-${stat.color}-900/30`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${stat.trendUp
                  ? "bg-success-50 text-success-600"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}>
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue and Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100/70 dark:bg-green-900/30">
                <DollarSign size={20} className="text-green-500" />
              </div>
              <h2 className="text-lg font-semibold">Doanh thu</h2>
            </div>
            <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold gradient-text">
              {/* {((dashboardData?.overview.totalRevenue.amount || 0) / 1000).toFixed(0)}K VND */}
              {formatMoney(dashboardData?.overview.totalRevenue.amount || 0)}
            </span>
            <span className="ml-2 text-sm text-success-600 flex items-center">
              <TrendingUp size={14} className="mr-1" />
              {(dashboardData?.overview.totalRevenue.growth || 0) >= 0 ? '+' : ''}{dashboardData?.overview.totalRevenue.growth || 0}%
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            So với tháng trước
          </div>

          {/* Fake chart - in a real app, use a proper chart library */}
          <div className="mt-6 h-48 w-full bg-gray-50/50 dark:bg-gray-800/50 rounded-lg overflow-hidden">
            <div className="h-full w-full flex items-end justify-around px-2">
              {[35, 45, 30, 60, 75, 45, 55, 70, 60, 80, 65, 75].map((height, i) => (
                <div key={i} className="h-full flex items-end">
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-6 rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 opacity-${Math.floor(height / 10) * 10}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Status Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100/70 dark:bg-yellow-900/30">
                <Ticket size={20} className="text-yellow-500" />
              </div>
              <h2 className="text-lg font-semibold">Trạng thái đặt vé</h2>
            </div>
            <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {dashboardData?.charts.bookingsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.status === 'CONFIRMED' ? 'bg-green-500' :
                      item.status === 'PENDING' ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}></div>
                  <span className="text-sm font-medium">
                    {item.status === 'CONFIRMED' ? 'Đã xác nhận' :
                      item.status === 'PENDING' ? 'Đang chờ' :
                        'Đã hủy'}
                  </span>
                </div>
                <span className="font-bold">{item.count}</span>
              </div>
            ))}

            {/* Simple bar chart */}
            <div className="mt-6 space-y-2">
              {dashboardData?.charts.bookingsByStatus.map((item) => {
                const total = dashboardData.charts.bookingsByStatus.reduce((sum, b) => sum + b.count, 0);
                const percentage = (item.count / total) * 100;
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.status}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.status === 'CONFIRMED' ? 'bg-green-500' :
                            item.status === 'PENDING' ? 'bg-yellow-500' :
                              'bg-red-500'
                          }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Movies and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Movies */}
        {dashboardData?.topMovies && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100/70 dark:bg-blue-900/30">
                  <Film size={20} className="text-blue-500" />
                </div>
                <h2 className="text-lg font-semibold">Top Phim</h2>
              </div>
            </div>
            <div className="space-y-3">
              {dashboardData.topMovies.slice(0, 5).map((movie) => (
                <div key={movie.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star size={12} fill="#FFD700" className="text-yellow-500" />
                      <span>{movie.rating}</span>
                      <span>•</span>
                      <span>{movie.bookingCount} đặt vé</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        {dashboardData?.recentBookings && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100/70 dark:bg-green-900/30">
                  <Ticket size={20} className="text-green-500" />
                </div>
                <h2 className="text-lg font-semibold">Đặt vé gần đây</h2>
              </div>
            </div>
            <div className="space-y-3">
              {dashboardData.recentBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div>
                    <h3 className="font-medium text-sm">{booking.customerName}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{booking.movieTitle}</p>
                    <p className="text-xs text-gray-400">{booking.bookingCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{(booking.totalPrice / 1000).toFixed(0)}K</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top Theaters */}
      {dashboardData?.topTheaters && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100/70 dark:bg-purple-900/30">
                <Activity size={20} className="text-purple-500" />
              </div>
              <h2 className="text-lg font-semibold">Top Rạp chiếu</h2>
            </div>
            <button className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm font-medium flex items-center">
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.topTheaters.map((theater, index) => (
              <div key={theater.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' :
                          'bg-blue-500'
                    }`}>
                    #{index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{theater.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{theater.location}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">{theater.bookingCount} đặt vé</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
