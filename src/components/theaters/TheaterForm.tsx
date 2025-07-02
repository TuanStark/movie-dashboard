// Fixed TheaterForm.tsx
import React, { useState, useEffect } from 'react';
import type { Theater } from '../../data/mock-data';
import { X } from 'lucide-react';
import ImageUpload from '../ImageUpload';

interface TheaterFormProps {
  theater?: Theater;
  onSubmit: (theater: Omit<Theater, 'id'>) => void;
  onCancel: () => void;
}

// Extend the Theater type to include the file object for the form
interface TheaterFormData extends Omit<Theater, 'id'> {
  logoFile?: File | null;
}

// Default empty theater object
const emptyTheater: TheaterFormData = {
  name: '',
  location: '',
  logo: '', // Default image
  coordinates: {
    lat: 10.762622,  // Default latitude (example: Ho Chi Minh City)
    lng: 106.660172   // Default longitude (example: Ho Chi Minh City)
  }
};

const TheaterForm: React.FC<TheaterFormProps> = ({ theater, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TheaterFormData>(emptyTheater);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with theater data if provided (edit mode)
  useEffect(() => {
    if (theater) {
      setFormData({
        ...theater,
        logoFile: null
      });
    } else {
      setFormData(emptyTheater);
    }
  }, [theater]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'lat' || name === 'lng') {
      setFormData({
        ...formData,
        coordinates: {
          ...formData.coordinates,
          [name]: parseFloat(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (imageData: string | File) => {
    if (typeof imageData === 'string') {
      setFormData({
        ...formData,
        logoFile: null,
        logo: imageData,
      });
    } else {
      setFormData({
        ...formData,
        logoFile: imageData,
        logo: URL.createObjectURL(imageData),
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tên rạp không được để trống';
    if (!formData.location.trim()) newErrors.location = 'Địa chỉ không được để trống';
    // if (formData.coordinates.lat === 0 && formData.coordinates.lng === 0) {
    //   newErrors.coordinates = 'Vui lòng nhập tọa độ hợp lệ';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('location', formData.location);
      // Add coordinates if your backend expects them
      // formDataObj.append('latitude', formData.coordinates.lat.toString());
      // formDataObj.append('longitude', formData.coordinates.lng.toString());

      if (formData.logoFile) {
        console.log('formData.logoFile', formData.logoFile);
        formDataObj.append('file', formData.logoFile); // Key 'file' to match backend
      } else if (formData.logo && !theater) {
        // Only append logo URL if it's a new theater and no file is selected
        formDataObj.append('logo', formData.logo);
      }

      // Determine if this is an update or create operation
      const isUpdate = theater && theater.id;
      const url = isUpdate ? `http://localhost:8000/theaters/${theater.id}` : 'http://localhost:8000/theaters';
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
          name: formData.name,
          location: formData.location,
          logo: responseData?.data?.logo || formData.logo,
          coordinates: {
            lat: Number(formData.coordinates.lat) || 0,
            lng: Number(formData.coordinates.lng) || 0,
          },
        });
      } else {
        throw new Error(responseData.message || `Failed to ${isUpdate ? 'update' : 'create'} theater`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.message || 'Có lỗi khi gửi biểu mẫu';
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ marginTop: '0px' }}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {theater ? 'Chỉnh sửa rạp chiếu phim' : 'Thêm rạp chiếu phim mới'}
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
            {/* Theater Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Tên rạp <span className="text-red-500">*</span>
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
                placeholder="Nhập tên rạp chiếu phim"
              />
              {errors.name && (
                <p className="text-error-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border ${
                  errors.location ? 'border-error-500' : 'border-transparent'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Nhập địa chỉ rạp chiếu phim"
              />
              {errors.location && (
                <p className="text-error-500 text-xs">{errors.location}</p>
              )}
            </div>

            {/* Coordinates */}
            <div className="space-y-2">
              {/* <label className="block text-sm font-medium">
                Tọa độ <span className="text-red-500">*</span>
              </label> */}
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <label htmlFor="lat" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Vĩ độ (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    id="lat"
                    name="lat"
                    value={formData.coordinates.lat}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border ${
                      errors.coordinates ? 'border-error-500' : 'border-transparent'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="10.762622"
                  />
                </div> */}
                {/* <div>
                  <label htmlFor="lng" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Kinh độ (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    id="lng"
                    name="lng"
                    value={formData.coordinates.lng}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border ${
                      errors.coordinates ? 'border-error-500' : 'border-transparent'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="106.660172"
                  />
                </div> */}
              </div>
              {errors.coordinates && (
                <p className="text-error-500 text-xs">{errors.coordinates}</p>
              )}
            </div>

            {/* Logo Image */}
            <div className="space-y-2">
              <ImageUpload
                initialImage={formData.logo}
                onImageSelect={handleImageChange}
                label="Logo rạp"
                folder="movieTix"
                maxSize={1000000} // 1MB
                accept="image/jpeg,image/png,image/gif"
                disabled={isSubmitting}
              />
              {errors.image && (
                <p className="text-red-500 text-xs">{errors.image}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{theater ? 'Đang cập nhật...' : 'Đang thêm...'}</span>
                </>
              ) : (
                <span>{theater ? 'Cập nhật' : 'Thêm rạp'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TheaterForm;