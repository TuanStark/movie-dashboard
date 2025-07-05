import { Film, User, Ticket, Building2, Newspaper, TrendingUp, Calendar, ArrowUpRight, MoreHorizontal, Star, ChevronRight, Activity, DollarSign, Users } from "lucide-react";
import { movies, bookings, theaters, articles } from "../data/mock-data";
import { useState } from "react";

// Calculate statistics
const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
const avgRating = (movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length).toFixed(1);

const stats = [
  {
    label: "Phim",
    value: movies.length,
    icon: <Film size={20} className="text-blue-500" />,
    trend: "+5%",
    trendUp: true,
    color: "blue"
  },
  {
    label: "Người dùng",
    value: 10,
    icon: <User size={20} className="text-green-500" />,
    trend: "+12%",
    trendUp: true,
    color: "green"
  },
  {
    label: "Vé đặt",
    value: bookings.length,
    icon: <Ticket size={20} className="text-yellow-500" />,
    trend: "+8%",
    trendUp: true,
    color: "yellow"
  },
  {
    label: "Rạp",
    value: theaters.length,
    icon: <Building2 size={20} className="text-purple-500" />,
    trend: "0%",
    trendUp: false,
    color: "purple"
  },
  {
    label: "Bài viết",
    value: articles.length,
    icon: <Newspaper size={20} className="text-pink-500" />,
    trend: "+3%",
    trendUp: true,
    color: "pink"
  },
];

// Quick actions
const quickActions = [
  { label: "Thêm phim mới", icon: <Film size={16} className="text-blue-500" />, color: "blue" },
  { label: "Thêm người dùng", icon: <User size={16} className="text-green-500" />, color: "green" },
  { label: "Xem báo cáo", icon: <Activity size={16} className="text-purple-500" />, color: "purple" },
  { label: "Quản lý đặt vé", icon: <Ticket size={16} className="text-yellow-500" />, color: "yellow" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'popular'>('popular');
  
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
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                stat.trendUp 
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
            <span className="text-3xl font-bold gradient-text">${totalRevenue.toFixed(2)}</span>
            <span className="ml-2 text-sm text-success-600 flex items-center">
              <TrendingUp size={14} className="mr-1" /> +8.2%
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
                    className={`w-6 rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 opacity-${Math.floor(height/10) * 10}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100/70 dark:bg-yellow-900/30">
                <Star size={20} className="text-yellow-500" />
              </div>
              <h2 className="text-lg font-semibold">Đánh giá trung bình</h2>
            </div>
            <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreHorizontal size={18} />
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center h-48">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2"></circle>
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  className="stroke-yellow-500 animate-pulse-slow" 
                  strokeWidth="3"
                  strokeDasharray={`${(Number(avgRating) / 10) * 100} 100`}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <div className="text-4xl font-bold flex items-center">
                  {avgRating}
                  <Star size={18} fill="#FFD700" className="ml-1 text-yellow-500" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">trên 10</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
              Dựa trên {movies.length} phim
            </div>
          </div>
        </div>
      </div>

      {/* User Activity */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100/70 dark:bg-blue-900/30">
              <Users size={20} className="text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold">Hoạt động người dùng</h2>
          </div>
          <button className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm font-medium flex items-center">
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>
        
        {/* <div className="space-y-4">
          {users.slice(0, 5).map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} 
                  alt={`${user.firstName} ${user.lastName}`} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/30"
                />
                <div>
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {["Vừa đặt vé", "Đánh giá phim", "Bình luận mới", "Đăng ký thành viên", "Cập nhật hồ sơ"][index]}
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Movies Tab */}
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex p-4">
            <button 
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'popular' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent hover:border-gray-300 text-gray-500'
              }`}
              onClick={() => setActiveTab('popular')}
            >
              Phim nổi bật
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === 'upcoming' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent hover:border-gray-300 text-gray-500'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Phim sắp chiếu
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phim</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thể loại</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đạo diễn</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày chiếu</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đánh giá</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {movies
                .filter(movie => activeTab === 'upcoming' ? movie.upcoming : !movie.upcoming)
                .slice(0, 5)
                .map((movie) => (
                  <tr key={movie.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <img 
                          src={movie.posterPath} 
                          alt={movie.title} 
                          className="w-10 h-14 object-cover rounded-md mr-3 shadow-md" 
                        />
                        <div className="font-medium">{movie.title}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {movie.genres.map((genre, idx) => (
                          <span 
                            key={idx} 
                            className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">{movie.director}</td>
                    <td className="py-4 px-4 text-sm">{movie.releaseDate}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Star size={16} fill="#FFD700" className="mr-1 text-yellow-500" />
                        <span>{movie.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400">
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 text-sm font-medium flex items-center justify-center mx-auto">
            Xem tất cả phim <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
