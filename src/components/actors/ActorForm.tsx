import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import type { Actor } from '../../types/global-types';
import ServiceApi from '../../services/api';

interface ActorFormProps {
  actor?: Actor;
  onSubmit: (actor: Omit<Actor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

// Extend the Actor type to include the file object for the form
interface ActorFormData extends Omit<Actor, 'id' | 'createdAt' | 'updatedAt'> {
  file?: File | null;
}

// Default empty actor object
const emptyActor: ActorFormData = {
  name: '',
  photo: '', // Default photo
};

const ActorForm: React.FC<ActorFormProps> = ({ actor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ActorFormData>(emptyActor);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with actor data if provided (edit mode)
  useEffect(() => {
    if (actor) {
      setFormData({
        ...actor,
        file: null
      });
    } else {
      setFormData(emptyActor);
    }
  }, [actor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = (imageData: string | File) => {
    if (typeof imageData === 'string') {
      setFormData({
        ...formData,
        photo: imageData,
        file: null
      });
    } else {
      setFormData({
        ...formData,
        file: imageData,
        photo: URL.createObjectURL(imageData) // Set preview URL
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tên diễn viên không được để trống';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    try {
      // Create a FormData object for multipart/form-data
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);

      // Only append file if it exists
      if (formData.file) {
        formDataObj.append('file', formData.file);
      } else if (formData.photo && !actor) {
        // Only append photo URL if it's a new actor and no file is selected
        formDataObj.append('photo', formData.photo);
      }

      let response;

      if (actor) {
        // Update existing actor
        response = await ServiceApi.put(`/actors/${actor.id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new actor
        response = await ServiceApi.post('/actors', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Call the onSubmit callback with the response data
      const responseData = response.data.data || response.data;
      
      onSubmit({
        name: formData.name,
        photo: responseData.photo || formData.photo
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi khi gửi biểu mẫu';
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {actor ? 'Chỉnh sửa diễn viên' : 'Thêm diễn viên mới'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.form && (
            <div className="p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg text-error-600 dark:text-error-400 text-sm">
              {errors.form}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Actor Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Tên diễn viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border ${
                  errors.name ? 'border-error-500' : 'border-transparent'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Nhập tên diễn viên"
              />
              {errors.name && (
                <p className="text-error-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Actor Photo */}
            <div className="space-y-2">
              <ImageUpload
                initialImage={formData.photo}
                onImageSelect={handleImageSelect}
                label="Ảnh diễn viên"
                folder="actors"
                maxSize={1000000} // 1MB
                accept="image/jpeg,image/png,image/gif"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                actor ? 'Cập nhật' : 'Thêm mới'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActorForm;
