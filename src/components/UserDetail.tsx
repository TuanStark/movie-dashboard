import React, { useEffect, useState } from 'react';
import type { User, Booking } from '../data/mock-data';
import { X, Edit, Trash } from 'lucide-react';
import { bookings as allBookings } from '../data/mock-data';

interface UserDetailProps {
  user: User;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose, onEdit, onDelete }) => {
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Lấy thông tin chi tiết về các booking của user
    if (user.bookings && user.bookings.length > 0) {
      const bookingsDetail = allBookings.filter(booking => 
        user.bookings.includes(booking.id)
      );
      setUserBookings(bookingsDetail);
    }
  }, [user]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chi tiết người dùng</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            )}
            <h3 className="text-xl font-semibold mt-4">{user.firstName} {user.lastName}</h3>
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 mt-2">
              {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Số đặt vé</p>
              <p className="font-medium">{user.bookings?.length || 0}</p>
            </div>
          </div>
          
          {userBookings.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Lịch sử đặt vé</h4>
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Mã đặt vé</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Ngày</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {userBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 py-2 text-sm">{booking.bookingId}</td>
                        <td className="px-4 py-2 text-sm">{booking.bookingDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onDelete}
            className="btn btn-error btn-sm flex items-center gap-1"
          >
            <Trash size={16} />
            <span>Xóa</span>
          </button>
          <button
            onClick={onEdit}
            className="btn btn-primary btn-sm flex items-center gap-1"
          >
            <Edit size={16} />
            <span>Sửa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 