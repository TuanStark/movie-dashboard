import React, { useState, useEffect } from 'react';
import { X, Armchair, Building2, DollarSign } from 'lucide-react';
import type { Seat, Theater } from '../../types/global-types';
import ServiceApi from '../../services/api';

interface SeatFormProps {
  seat?: Seat | null;
  onSubmit: (seat: Omit<Seat, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const emptySeat: Omit<Seat, 'id'> = {
  theaterId: 0,
  row: '',
  number: 1,
  type: 'standard',
  price: 0
};

const SeatForm: React.FC<SeatFormProps> = ({ seat, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Seat, 'id'>>(seat || emptySeat);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTheaters();
  }, []);

  useEffect(() => {
    if (seat) {
      setFormData(seat);
    }
  }, [seat]);

  const fetchTheaters = async () => {
    try {
      const response = await ServiceApi.get('/theaters');
      setTheaters(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.theaterId) {
      newErrors.theaterId = 'Vui lòng chọn rạp';
    }
    if (!formData.row.trim()) {
      newErrors.row = 'Vui lòng nhập hàng ghế';
    }
    if (formData.number < 1) {
      newErrors.number = 'Số ghế phải lớn hơn 0';
    }
    if (!formData.type) {
      newErrors.type = 'Vui lòng chọn loại ghế';
    }
    if (formData.price < 0) {
      newErrors.price = 'Giá ghế không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting seat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Armchair className="text-blue-500" />
            {seat ? 'Chỉnh sửa ghế' : 'Thêm ghế mới'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Theater Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Building2 className="inline mr-2" size={16} />
              Rạp chiếu phim
            </label>
            <select
              value={formData.theaterId}
              onChange={(e) => handleChange('theaterId', parseInt(e.target.value))}
              className={`input ${errors.theaterId ? 'border-red-500' : ''}`}
              required
            >
              <option value={0}>Chọn rạp</option>
              {theaters.map(theater => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>
            {errors.theaterId && (
              <p className="text-red-500 text-sm mt-1">{errors.theaterId}</p>
            )}
          </div>

          {/* Row */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hàng ghế
            </label>
            <input
              type="text"
              value={formData.row}
              onChange={(e) => handleChange('row', e.target.value.toUpperCase())}
              className={`input ${errors.row ? 'border-red-500' : ''}`}
              placeholder="A, B, C..."
              maxLength={2}
              required
            />
            {errors.row && (
              <p className="text-red-500 text-sm mt-1">{errors.row}</p>
            )}
          </div>

          {/* Seat Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số ghế
            </label>
            <input
              type="number"
              value={formData.number}
              onChange={(e) => handleChange('number', parseInt(e.target.value))}
              className={`input ${errors.number ? 'border-red-500' : ''}`}
              min="1"
              required
            />
            {errors.number && (
              <p className="text-red-500 text-sm mt-1">{errors.number}</p>
            )}
          </div>

          {/* Seat Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại ghế
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className={`input ${errors.type ? 'border-red-500' : ''}`}
              required
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="inline mr-2" size={16} />
              Giá ghế (VND)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              className={`input ${errors.price ? 'border-red-500' : ''}`}
              min="0"
              step="1000"
              required
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Xem trước:</h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Armchair className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formData.row}{formData.number}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.type.toUpperCase()} - {formData.price.toLocaleString('vi-VN')} VND
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn btn-outline"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </div>
              ) : (
                seat ? 'Cập nhật' : 'Thêm ghế'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeatForm;
