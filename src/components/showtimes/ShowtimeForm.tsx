import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMovies } from '../../contexts/MovieContext';
import { useTheaters } from '../../contexts/TheaterContext';
import type { Showtime } from '../../data/mock-data';

interface ShowtimeFormProps {
  showtime?: Showtime;
  onSubmit: (showtime: Omit<Showtime, 'id'>) => void;
  onCancel: () => void;
}

// Default empty showtime object
const emptyShowtime: Omit<Showtime, 'id'> = {
  movieId: 0,
  theaterId: 0,
  date: new Date().toISOString().split('T')[0],
  time: '',
  price: 0
};

const ShowtimeForm: React.FC<ShowtimeFormProps> = ({ showtime, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Showtime, 'id'>>(emptyShowtime);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { movies } = useMovies();
  const { theaters } = useTheaters();

  // Initialize form with showtime data if provided (edit mode)
  useEffect(() => {
    if (showtime) {
      setFormData(showtime);
    }
  }, [showtime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'movieId' || name === 'theaterId') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10)
      });
    } else if (name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
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
    
    if (formData.movieId <= 0) newErrors.movieId = 'Vui lòng chọn phim';
    if (formData.theaterId <= 0) newErrors.theaterId = 'Vui lòng chọn rạp';
    if (!formData.date) newErrors.date = 'Vui lòng chọn ngày';
    if (!formData.time) newErrors.time = 'Vui lòng nhập giờ chiếu';
    if (formData.price <= 0) newErrors.price = 'Giá vé phải lớn hơn 0';
    
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ marginTop: '0px' }}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {showtime ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu mới'}
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
            {/* Movie Selection */}
            <div className="space-y-2">
              <label htmlFor="movieId" className="block text-sm font-medium">
                Phim
              </label>
              <select
                id="movieId"
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                  errors.movieId ? 'border-2 border-error-500' : ''
                }`}
              >
                <option value="0">Chọn phim</option>
                {movies.map(movie => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              {errors.movieId && (
                <p className="text-error-500 text-xs">{errors.movieId}</p>
              )}
            </div>

            {/* Theater Selection */}
            <div className="space-y-2">
              <label htmlFor="theaterId" className="block text-sm font-medium">
                Rạp chiếu
              </label>
              <select
                id="theaterId"
                name="theaterId"
                value={formData.theaterId}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                  errors.theaterId ? 'border-2 border-error-500' : ''
                }`}
              >
                <option value="0">Chọn rạp</option>
                {theaters.map(theater => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name}
                  </option>
                ))}
              </select>
              {errors.theaterId && (
                <p className="text-error-500 text-xs">{errors.theaterId}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium">
                Ngày chiếu
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                  errors.date ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.date && (
                <p className="text-error-500 text-xs">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium">
                Giờ chiếu
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                  errors.time ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.time && (
                <p className="text-error-500 text-xs">{errors.time}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium">
                Giá vé
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="1000"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                  errors.price ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.price && (
                <p className="text-error-500 text-xs">{errors.price}</p>
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
              {showtime ? 'Cập nhật' : 'Thêm suất chiếu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShowtimeForm; 