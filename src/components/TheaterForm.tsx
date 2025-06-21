import React, { useState, useEffect } from 'react';
import type { Theater } from '../data/mock-data';
import { X } from 'lucide-react';

interface TheaterFormProps {
  theater?: Theater;
  onSubmit: (theater: Omit<Theater, 'id'>) => void;
  onCancel: () => void;
}

// Default empty theater object
const emptyTheater: Omit<Theater, 'id'> = {
  name: '',
  location: '',
  coordinates: {
    lat: 0,
    lng: 0
  }
};

const TheaterForm: React.FC<TheaterFormProps> = ({ theater, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Theater, 'id'>>(emptyTheater);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with theater data if provided (edit mode)
  useEffect(() => {
    if (theater) {
      setFormData(theater);
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
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tên rạp không được để trống';
    if (!formData.location.trim()) newErrors.location = 'Địa chỉ không được để trống';
    if (formData.coordinates.lat === 0 && formData.coordinates.lng === 0) {
      newErrors.coordinates = 'Vui lòng nhập tọa độ hợp lệ';
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
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {theater ? 'Chỉnh sửa rạp chiếu phim' : 'Thêm rạp chiếu phim mới'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Theater Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Tên rạp
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                  errors.name ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.name && (
                <p className="text-error-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium">
                Địa chỉ
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                  errors.location ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.location && (
                <p className="text-error-500 text-xs">{errors.location}</p>
              )}
            </div>

            {/* Coordinates */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Tọa độ
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                    className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                      errors.coordinates ? 'border-2 border-error-500' : ''
                    }`}
                  />
                </div>
                <div>
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
                    className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                      errors.coordinates ? 'border-2 border-error-500' : ''
                    }`}
                  />
                </div>
              </div>
              {errors.coordinates && (
                <p className="text-error-500 text-xs">{errors.coordinates}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              {theater ? 'Cập nhật' : 'Thêm rạp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TheaterForm; 