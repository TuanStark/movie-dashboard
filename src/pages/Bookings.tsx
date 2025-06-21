import React, { useState } from "react";
import { useBookings } from "../contexts/BookingContext";
import { users, movies } from "../data/mock-data";
import { Ticket, Search, Filter, User, Film, Calendar, DollarSign, CheckCircle, Clock, Ban, Check, Eye } from "lucide-react";
import BookingDetail from "../components/BookingDetail";

export default function Bookings() {
  const { bookings } = useBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "price">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);
  
  // Lọc và sắp xếp bookings
  const filteredBookings = bookings
    .filter(booking => {
      // Filter by search term
      if (searchTerm) {
        const user = users.find(u => u.id === booking.userId);
        const movie = movies.find(m => m.id === booking.movieId);
        const searchLower = searchTerm.toLowerCase();
        
        const matchesSearch = booking.bookingId.toLowerCase().includes(searchLower) ||
          (user && `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)) ||
          (movie && movie.title.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }
      
      // Filter by status
      if (statusFilter && booking.status !== statusFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.bookingDate).getTime();
        const dateB = new Date(b.bookingDate).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === "asc" 
          ? a.totalPrice - b.totalPrice 
          : b.totalPrice - a.totalPrice;
      }
    });
  
  const toggleSort = (field: "date" | "price") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  const statusOptions = [
    { value: "confirmed", label: "Đã xác nhận", icon: <CheckCircle size={16} className="text-success-500" />, color: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300" },
    { value: "pending", label: "Đang chờ", icon: <Clock size={16} className="text-warning-500" />, color: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300" },
    { value: "cancelled", label: "Đã hủy", icon: <Ban size={16} className="text-error-500" />, color: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300" },
    { value: "completed", label: "Đã hoàn thành", icon: <Check size={16} className="text-primary-500" />, color: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" }
  ];
  
  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status) || statusOptions[0];
    return (
      <span className={`px-2 py-1 rounded-lg flex items-center gap-1.5 text-xs ${option.color}`}>
        {option.icon}
        {option.label}
      </span>
    );
  };
  
  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-100/70 dark:bg-yellow-900/30">
            <Ticket size={24} className="text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Danh sách vé đặt</h1>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6 mb-6">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã vé, người đặt hoặc phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-none rounded-xl bg-gray-50/80 dark:bg-gray-700/80 focus:ring-2 focus:ring-primary-500/70 transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                sortBy === "date" 
                  ? "bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300" 
                  : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => toggleSort("date")}
            >
              <Calendar size={16} />
              <span>Ngày</span>
              {sortBy === "date" && (
                <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
            
            <button 
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                sortBy === "price" 
                  ? "bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300" 
                  : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => toggleSort("price")}
            >
              <DollarSign size={16} />
              <span>Giá</span>
              {sortBy === "price" && (
                <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Lọc theo trạng thái</h3>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                statusFilter === null
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover-lift"
              }`}
              onClick={() => setStatusFilter(null)}
            >
              <span>Tất cả</span>
            </button>
            
            {statusOptions.map(option => (
              <button
                key={option.value}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  statusFilter === option.value 
                    ? option.color + " ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-" + option.value + "-500/50"
                    : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover-lift"
                }`}
                onClick={() => setStatusFilter(option.value)}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full divide-y divide-gray-200/80 dark:divide-gray-700/80">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <tr>
                <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-tl-xl">Mã vé</th>
                <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Người đặt</th>
                <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phim</th>
                <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày đặt</th>
                <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="py-3.5 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tổng tiền</th>
                <th className="py-3.5 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-tr-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm divide-y divide-gray-200/80 dark:divide-gray-700/80">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const user = users.find(u => u.id === booking.userId);
                  const movie = movies.find(m => m.id === booking.movieId);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50/90 dark:hover:bg-gray-750/90 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-medium text-primary-600 dark:text-primary-400">{booking.bookingId}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {user?.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={`${user.firstName} ${user.lastName}`} 
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/30 ring-offset-1 ring-offset-white dark:ring-offset-gray-800"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-sm">
                              <User size={16} className="text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          <span>{user ? `${user.firstName} ${user.lastName}` : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {movie && (
                            <div className="w-10 h-14 rounded-md overflow-hidden shadow-sm">
                              <img 
                                src={movie.posterPath} 
                                alt={movie.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span>{movie ? movie.title : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{booking.bookingDate}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(booking.status || "confirmed")}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-medium text-success-600 dark:text-success-400">${booking.totalPrice.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy vé đặt nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số vé: <span className="font-medium text-gray-800 dark:text-gray-200">{filteredBookings.length}</span>
            </div>
            <div className="text-sm font-medium">
              Tổng doanh thu: <span className="text-success-600 dark:text-success-400">${filteredBookings.reduce((sum, booking) => sum + booking.totalPrice, 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {selectedBooking && (
        <BookingDetail 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}
    </div>
  );
} 