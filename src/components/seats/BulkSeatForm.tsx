import React, { useState, useEffect } from 'react';
import { X, Armchair, Building2, DollarSign, Plus, Minus } from 'lucide-react';
import type { Theater } from '../../types/global-types';
import ServiceApi from '../../services/api';

interface BulkSeatFormProps {
  theater?: Theater | null;
  onSubmit: (data: {
    theaterId: number;
    rows: string[];
    seatsPerRow: number;
    type: string;
    price: number;
  }) => Promise<void>;
  onCancel: () => void;
}

const BulkSeatForm: React.FC<BulkSeatFormProps> = ({ theater, onSubmit, onCancel }) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [formData, setFormData] = useState({
    theaterId: theater?.id || 0,
    startRow: 'A',
    endRow: 'J',
    seatsPerRow: 10,
    type: 'standard',
    price: 50000
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string[]>([]);

  useEffect(() => {
    if (!theater) {
      fetchTheaters();
    }
  }, [theater]);

  useEffect(() => {
    generatePreview();
  }, [formData.startRow, formData.endRow]);

  const fetchTheaters = async () => {
    try {
      const response = await ServiceApi.get('/theaters');
      setTheaters(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  const generateRowRange = (start: string, end: string): string[] => {
    const rows: string[] = [];
    const startCode = start.charCodeAt(0);
    const endCode = end.charCodeAt(0);
    
    if (startCode <= endCode) {
      for (let i = startCode; i <= endCode; i++) {
        rows.push(String.fromCharCode(i));
      }
    }
    
    return rows;
  };

  const generatePreview = () => {
    const rows = generateRowRange(formData.startRow, formData.endRow);
    setPreview(rows);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.theaterId) {
      newErrors.theaterId = 'Vui lòng chọn rạp';
    }
    if (!formData.startRow) {
      newErrors.startRow = 'Vui lòng nhập hàng bắt đầu';
    }
    if (!formData.endRow) {
      newErrors.endRow = 'Vui lòng nhập hàng kết thúc';
    }
    if (formData.startRow && formData.endRow && formData.startRow.charCodeAt(0) > formData.endRow.charCodeAt(0)) {
      newErrors.endRow = 'Hàng kết thúc phải sau hàng bắt đầu';
    }
    if (formData.seatsPerRow < 1) {
      newErrors.seatsPerRow = 'Số ghế mỗi hàng phải lớn hơn 0';
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
      const rows = generateRowRange(formData.startRow, formData.endRow);
      await onSubmit({
        theaterId: formData.theaterId,
        rows,
        seatsPerRow: formData.seatsPerRow,
        type: formData.type,
        price: formData.price
      });
    } catch (error) {
      console.error('Error submitting bulk seats:', error);
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

  const totalSeats = preview.length * formData.seatsPerRow;
  const totalCost = totalSeats * formData.price;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Armchair className="text-blue-500" />
            Tạo ghế hàng loạt
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Theater Selection */}
          {!theater && (
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
                {theaters.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {errors.theaterId && (
                <p className="text-red-500 text-sm mt-1">{errors.theaterId}</p>
              )}
            </div>
          )}

          {/* Row Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hàng bắt đầu
              </label>
              <input
                type="text"
                value={formData.startRow}
                onChange={(e) => handleChange('startRow', e.target.value.toUpperCase())}
                className={`input ${errors.startRow ? 'border-red-500' : ''}`}
                placeholder="A"
                maxLength={1}
                required
              />
              {errors.startRow && (
                <p className="text-red-500 text-sm mt-1">{errors.startRow}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hàng kết thúc
              </label>
              <input
                type="text"
                value={formData.endRow}
                onChange={(e) => handleChange('endRow', e.target.value.toUpperCase())}
                className={`input ${errors.endRow ? 'border-red-500' : ''}`}
                placeholder="J"
                maxLength={1}
                required
              />
              {errors.endRow && (
                <p className="text-red-500 text-sm mt-1">{errors.endRow}</p>
              )}
            </div>
          </div>

          {/* Seats per row */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số ghế mỗi hàng
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleChange('seatsPerRow', Math.max(1, formData.seatsPerRow - 1))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={formData.seatsPerRow}
                onChange={(e) => handleChange('seatsPerRow', parseInt(e.target.value))}
                className={`input text-center ${errors.seatsPerRow ? 'border-red-500' : ''}`}
                min="1"
                required
              />
              <button
                type="button"
                onClick={() => handleChange('seatsPerRow', formData.seatsPerRow + 1)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Plus size={16} />
              </button>
            </div>
            {errors.seatsPerRow && (
              <p className="text-red-500 text-sm mt-1">{errors.seatsPerRow}</p>
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
              className="input"
              required
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
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
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Xem trước:</h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Hàng ghế:</strong> {preview.join(', ')} ({preview.length} hàng)
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Tổng số ghế:</strong> {totalSeats} ghế
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Loại ghế:</strong> {formData.type.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Tổng giá trị:</strong> {totalCost.toLocaleString('vi-VN')} VND
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
                  Đang tạo...
                </div>
              ) : (
                `Tạo ${totalSeats} ghế`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkSeatForm;
