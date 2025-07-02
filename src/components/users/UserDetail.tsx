import React from 'react';
import type { User } from '../../types/global-types';
import { X } from 'lucide-react';

interface UserDetailProps {
  user: User;
  onClose: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose}) => {  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ marginTop: '0px' }}>
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
              {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </div>

          <div className="space-y-4 mb-4 border-b border-gray-200 dark:border-gray-700 pb-4 flex flex-col gap-4">
            <div className="flex flex-row gap-4 justify-around items-center">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Vai trò</p>
                <p className="font-medium">{user.role}</p>
              </div>
            </div>
            <div className="flex flex-row gap-4 justify-around items-center">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tên</p>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Trạng thái</p>
                <p
                  className={`font-medium border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 text-white ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                  {user.status === 'active' ? 'Hoạt động' : 'Khóa'}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 