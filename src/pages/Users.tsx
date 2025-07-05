import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash, User as UserIcon, Users as UsersIcon, Mail, Shield } from 'lucide-react';
import UserForm from '../components/users/UserForm';
import UserDetail from '../components/users/UserDetail';
import ServiceApi from '../services/api';
import type { Users } from '../types/global-types';
import DeleteChangeStatus from '../components/DeleteChangeStatus';

const Users: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await ServiceApi.get('/user/all');
      setUsers(response.data.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc users theo tìm kiếm và vai trò
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleUpdateUser = async () => {
    setEditingUserId(null);
    await fetchUsers();
  };

  const handleDeleteUser = async () => {
    if (deletingUserId !== null) {
      setDeletingUserId(null);
      await fetchUsers();
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100/70 dark:bg-green-900/30">
            <UsersIcon size={24} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Quản lý người dùng</h1>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-none rounded-xl bg-gray-50/80 dark:bg-gray-700/80 focus:ring-2 focus:ring-primary-500/70 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-none rounded-xl bg-gray-50/80 dark:bg-gray-700/80 appearance-none focus:ring-2 focus:ring-primary-500/70 transition-all"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full divide-y divide-gray-200/80 dark:divide-gray-700/80">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3.5 rounded-tl-xl">Người dùng</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Vai trò</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5 text-right rounded-tr-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm divide-y divide-gray-200/80 dark:divide-gray-700/80">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/90 dark:hover:bg-gray-750/90 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-10 h-10 rounded-full mr-3 object-cover ring-2 ring-primary-500/30 ring-offset-1 ring-offset-white dark:ring-offset-gray-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mr-3 shadow-sm">
                            <UserIcon size={18} className="text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-primary-100/80 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'
                            : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {user.role === 'ADMIN' ? (
                          <>
                            <Shield size={12} />
                            Quản trị viên
                          </>
                        ) : (
                          <>
                            <UserIcon size={12} />
                            Người dùng
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {user.status === 'active' ? 'Hoạt động' : 'Khoá'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewingUserId(user.id)}
                          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Xem chi tiết"
                        >
                          <MoreVertical size={18} />
                        </button>
                        <button
                          onClick={() => setEditingUserId(user.id)}
                          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingUserId(user.id)}
                          className="p-1.5 rounded-md hover:bg-error-50 dark:hover:bg-error-900/20 text-error-500 transition-colors"
                          title="Xóa"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Edit User Form */}
      {editingUserId !== null && (
        <UserForm
          user={users.find(user => user.id === editingUserId)!}
          onSubmit={() => handleUpdateUser()}
          onCancel={() => setEditingUserId(null)}
        />
      )}

      {/* View User Detail */}
      {viewingUserId !== null && (
        <UserDetail
          user={users.find(user => user.id === viewingUserId)!}
          onClose={() => setViewingUserId(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deletingUserId !== null && (
        <DeleteChangeStatus
          title="Xóa người dùng"
          message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
          onConfirm={handleDeleteUser}
          onCancel={() => setDeletingUserId(null)}
          status="inactive"
          id={deletingUserId}
        />
      )}
    </div>
  );
};

export default Users; 