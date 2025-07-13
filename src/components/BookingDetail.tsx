import React from "react";
import { X, Calendar, User, Film, Clock, Ban, CheckCircle } from "lucide-react";
import type { Bookings } from "../types/global-types";
import formatMoney from "../types/format-money";
import { formatDateTime } from "../types/format-datetime";

interface BookingDetailProps {
  booking: Bookings
  onClose: () => void;
  onEditStatus: () => void;
}

const BookingDetail: React.FC<BookingDetailProps> = ({ booking, onClose, onEditStatus }) => {

  const user = booking.user;
  const movie = booking?.showtime?.movie;

  const statusOptions = [
    { value: "CONFIRMED", label: "Đã xác nhận", icon: <CheckCircle size={16} className="text-success-500" />, color: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300" },
    { value: "PENDING", label: "Đang chờ", icon: <Clock size={16} className="text-warning-500" />, color: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300" },
    { value: "CANCELLED", label: "Đã hủy", icon: <Ban size={16} className="text-error-500" />, color: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300" },
    // { value: "COMPLETED", label: "Đã hoàn thành", icon: <Check size={16} className="text-primary-500" />, color: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" }
  ];

  const handleStatusChange = async (id: number, status: string) => {
    const url = `${import.meta.env.VITE_URL}booking/${id}`;
    const method = 'PATCH';

    // Send movie data
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ status: status })
    });

    const responseData = await response.json();

    if (response.ok) {
      onEditStatus();
      onClose();
    } else {
      throw new Error(responseData.message || `Failed to update booking`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: '0px' }}>
      <div className="glass-card rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-200/80 dark:border-gray-700/80">
          <h2 className="text-xl font-bold gradient-text">Chi tiết đặt vé #{booking.bookingCode}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(option => (
                booking.status === option.value ? (
                  <span
                    key={option.value}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${option.color}`}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </span>
                ) : (
                  <button
                    key={option.value}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover-lift`}
                    onClick={() => handleStatusChange(booking.id, option.value)}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <User size={16} />
              Thông tin khách hàng
            </h3>
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <User size={20} className="text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-medium">{user ? `${user.firstName} ${user.lastName}` : 'N/A'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Film size={16} />
              Thông tin phim
            </h3>
            <div className="flex gap-4">
              {movie && (
                <div className="w-20 h-28 rounded-md overflow-hidden shadow-sm">
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{movie?.title || 'N/A'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{movie?.duration || 'N/A'}</p>
                {/* {movie?.genres && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {movie.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 text-xs rounded-full bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )} */}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Film size={16} />
              Phương thức thanh toán
            </h3>
            <div className="flex gap-4">
              {/* {booking && (
                <div className="w-20 h-28 rounded-md overflow-hidden shadow-sm cursor-pointer"
                  onClick={() => setIsOpen(true)}>
                  <img
                    src={booking.images}
                    className="w-full h-full object-cover"
                  />
                </div>
              )} */}
              <span className="text-lg">{booking.paymentMethod}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày đặt</h3>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-gray-400" />
                  {formatDateTime(booking.bookingDate)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng tiền</h3>
                <p className="font-medium text-success-600 dark:text-success-400 mt-1">
                  ${formatMoney(booking.totalPrice)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ghế đã đặt</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {booking.seats.map((seat, index) => (
                  <span
                    key={index}
                    className={`${seat.seat.type === 'VIP' ? "bg-yellow-500 text-white" : "bg-gray-500 text-white"} px-3 py-1 rounded-lg font-medium`}
                  >
                    {seat.seat.row}{seat.seat.number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200/80 dark:border-gray-700/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            Đóng
          </button>
        </div>


      </div>
    </div>
  );
};

export default BookingDetail; 