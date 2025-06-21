import React, { useState, useEffect } from 'react';
import type { User } from '../data/mock-data';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface UserFormProps {
  user?: User;
  onSubmit: (user: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

// Default empty user object
const emptyUser: Omit<User, 'id'> = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'user',
  avatar: '',
  bookings: []
};

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>(emptyUser);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user data if provided (edit mode)
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAvatarChange = (imageData: string) => {
    setFormData({
      ...formData,
      avatar: imageData
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Tên không được để trống';
    if (!formData.lastName.trim()) newErrors.lastName = 'Họ không được để trống';
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    if (!user && !formData.password.trim()) newErrors.password = 'Mật khẩu không được để trống';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <ImageUpload
              initialImage={formData.avatar}
              onImageChange={handleAvatarChange}
              className="w-full max-w-[200px]"
              label="Avatar người dùng"
            />
          </div>
          
          <div className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium">
                Tên
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.firstName ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.firstName && (
                <p className="text-error-500 text-xs">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium">
                Họ
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.lastName ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.lastName && (
                <p className="text-error-500 text-xs">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.email ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-error-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                {user ? 'Mật khẩu mới (để trống nếu không thay đổi)' : 'Mật khẩu'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.password ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.password && (
                <p className="text-error-500 text-xs">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium">
                Vai trò
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {user ? 'Cập nhật' : 'Thêm người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm; 