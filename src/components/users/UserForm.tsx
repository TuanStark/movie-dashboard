import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import type { User } from '../../types/global-types';

interface UserFormProps {
  user?: User;
  onSubmit: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

// Extend the User type to include the file object for the form
interface UserFormData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  file?: File | null;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
    avatar: '',
    status: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data if provided (edit mode)
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '' // Clear password in edit mode
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (imageData: string | File) => {
    if (typeof imageData === 'string') {
      setFormData(prev => ({
        ...prev,
        avatar: imageData,
        file: null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        file: imageData,
        avatar: URL.createObjectURL(imageData)
      }));
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataObj = new FormData();
      formDataObj.append('firstName', formData.firstName);
      formDataObj.append('lastName', formData.lastName);
      formDataObj.append('email', formData.email);
      formDataObj.append('role', formData.role);
      formDataObj.append('status', formData.status);
      
      // if (formData.password.trim()) {
      //   formDataObj.append('password', formData.password);
      // }

      // Only append file if it exists
      if (formData.file) {
        formDataObj.append('file', formData.file);
      } else if (formData.avatar && !user) {
        // Only append avatar URL if it's a new user and no file is selected
        formDataObj.append('avatar', formData.avatar);
      }

      // Determine if this is an update or create operation
      const isUpdate = user && user.id;
      const url = isUpdate ? `http://localhost:8000/user/${user.id}` : 'http://localhost:8000/user';
      const method = isUpdate ? 'PATCH' : 'POST';

      // Use fetch API
      const response = await fetch(url, {
        method: method,
        body: formDataObj,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const responseData = await response.json();

      if (response.ok) {
        // Success - call onSubmit with the theater data
        onSubmit({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          avatar: responseData?.data?.avatar || formData.avatar,
          status: formData.status,
          password: formData.password,
        });
      } else {
        throw new Error(responseData.message || `Failed to ${isUpdate ? 'update' : 'create'} theater`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi khi gửi biểu mẫu';
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ marginTop: '0px' }}>
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
              onImageSelect={handleImageSelect}
              className="w-full max-w-[200px]"
              label="Avatar người dùng"
              maxSize={1000000} // 1MB
              accept="image/jpeg,image/png,image/gif"
              disabled={isSubmitting}
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

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Khoá</option>
              </select>
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
                <option value="USER">Người dùng</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>

            {/* Form Error */}
            {errors.form && (
              <div className="p-4 bg-error-50 dark:bg-error-900/20 text-error-500 rounded-lg text-sm">
                {errors.form}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : user ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm; 