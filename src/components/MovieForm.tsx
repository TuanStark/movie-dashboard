import React, { useState, useEffect } from 'react';
import type { Movie, Showtime } from '../data/mock-data';
import { X, Plus, Trash, Clock } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { theaters } from '../data/mock-data';

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (movie: Omit<Movie, 'id'>, showtimes: Omit<Showtime, 'id'>[]) => void;
  onCancel: () => void;
}

// Default empty movie object
const emptyMovie: Omit<Movie, 'id'> = {
  title: '',
  posterPath: '',
  backdropPath: '',
  genres: [],
  rating: 0,
  synopsis: '',
  duration: '',
  director: '',
  cast: [],
  releaseDate: '',
  trailerUrl: '',
  upcoming: false
};

interface ShowtimeInput {
  theaterId: number;
  date: string;
  time: string;
  price: number;
}

const defaultShowtime: ShowtimeInput = {
  theaterId: 0,
  date: '',
  time: '',
  price: 0
};

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Movie, 'id'>>(emptyMovie);
  const [genreInput, setGenreInput] = useState('');
  const [castInput, setCastInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showtimes, setShowtimes] = useState<ShowtimeInput[]>([]);
  const [showtimeErrors, setShowtimeErrors] = useState<Record<number, Record<string, string>>>({});

  // Initialize form with movie data if provided (edit mode)
  useEffect(() => {
    if (movie) {
      setFormData(movie);
      // Trong trường hợp thực tế, bạn sẽ cần tải showtimes từ API
      // Đây chỉ là ví dụ, trong thực tế bạn sẽ cần lấy showtimes từ context hoặc API
    }
  }, [movie]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handlePosterChange = (imageData: string) => {
    setFormData({
      ...formData,
      posterPath: imageData
    });
  };

  const handleBackdropChange = (imageData: string) => {
    setFormData({
      ...formData,
      backdropPath: imageData
    });
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genres.includes(genreInput.trim())) {
      setFormData({
        ...formData,
        genres: [...formData.genres, genreInput.trim()]
      });
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter(g => g !== genre)
    });
  };

  const handleAddCastMember = () => {
    if (castInput.trim() && !formData.cast.includes(castInput.trim())) {
      setFormData({
        ...formData,
        cast: [...formData.cast, castInput.trim()]
      });
      setCastInput('');
    }
  };

  const handleRemoveCastMember = (castMember: string) => {
    setFormData({
      ...formData,
      cast: formData.cast.filter(c => c !== castMember)
    });
  };

  // Xử lý thêm suất chiếu mới
  const handleAddShowtime = () => {
    setShowtimes([...showtimes, { ...defaultShowtime }]);
  };

  // Xử lý xóa suất chiếu
  const handleRemoveShowtime = (index: number) => {
    const newShowtimes = [...showtimes];
    newShowtimes.splice(index, 1);
    setShowtimes(newShowtimes);
    
    // Cập nhật lỗi
    const newErrors = { ...showtimeErrors };
    delete newErrors[index];
    setShowtimeErrors(newErrors);
  };

  // Xử lý thay đổi thông tin suất chiếu
  const handleShowtimeChange = (index: number, field: keyof ShowtimeInput, value: string | number) => {
    const newShowtimes = [...showtimes];
    newShowtimes[index] = {
      ...newShowtimes[index],
      [field]: value
    };
    setShowtimes(newShowtimes);
    
    // Xóa lỗi khi người dùng sửa
    if (showtimeErrors[index] && showtimeErrors[index][field as string]) {
      const newErrors = { ...showtimeErrors };
      delete newErrors[index][field as string];
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index];
      }
      setShowtimeErrors(newErrors);
    }
  };

  const validateShowtimes = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;
    
    showtimes.forEach((showtime, index) => {
      const showtimeError: Record<string, string> = {};
      
      if (!showtime.theaterId) {
        showtimeError.theaterId = 'Vui lòng chọn rạp chiếu phim';
        isValid = false;
      }
      
      if (!showtime.date) {
        showtimeError.date = 'Vui lòng chọn ngày chiếu';
        isValid = false;
      }
      
      if (!showtime.time) {
        showtimeError.time = 'Vui lòng nhập giờ chiếu';
        isValid = false;
      }
      
      if (!showtime.price || showtime.price <= 0) {
        showtimeError.price = 'Giá vé phải lớn hơn 0';
        isValid = false;
      }
      
      if (Object.keys(showtimeError).length > 0) {
        newErrors[index] = showtimeError;
      }
    });
    
    setShowtimeErrors(newErrors);
    return isValid;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!formData.posterPath) newErrors.posterPath = 'Poster phim không được để trống';
    if (!formData.director.trim()) newErrors.director = 'Tên đạo diễn không được để trống';
    if (!formData.releaseDate.trim()) newErrors.releaseDate = 'Ngày phát hành không được để trống';
    if (formData.genres.length === 0) newErrors.genres = 'Phải có ít nhất một thể loại';
    if (formData.rating < 0 || formData.rating > 10) newErrors.rating = 'Đánh giá phải từ 0-10';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isMovieValid = validate();
    const areShowtimesValid = validateShowtimes();
    
    if (isMovieValid && areShowtimesValid) {
      // Chuyển đổi ShowtimeInput sang định dạng Showtime (không có id)
      const formattedShowtimes = showtimes.map(showtime => ({
        movieId: movie?.id || 0, // Sẽ được cập nhật sau khi tạo phim mới
        theaterId: showtime.theaterId,
        date: showtime.date,
        time: showtime.time,
        price: showtime.price
      }));
      
      onSubmit(formData, formattedShowtimes);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {movie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Tiêu đề
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.title && (
                <p className="text-error-500 text-xs">{errors.title}</p>
              )}
            </div>

            {/* Director */}
            <div className="space-y-2">
              <label htmlFor="director" className="block text-sm font-medium">
                Đạo diễn
              </label>
              <input
                type="text"
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.director ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.director && (
                <p className="text-error-500 text-xs">{errors.director}</p>
              )}
            </div>

            {/* Poster Path */}
            <div className="space-y-2">
              <ImageUpload
                initialImage={formData.posterPath}
                onImageChange={handlePosterChange}
                label="Poster phim"
              />
              {errors.posterPath && (
                <p className="text-error-500 text-xs">{errors.posterPath}</p>
              )}
            </div>

            {/* Backdrop Path */}
            <div className="space-y-2">
              <ImageUpload
                initialImage={formData.backdropPath}
                onImageChange={handleBackdropChange}
                label="Ảnh nền (backdrop)"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium">
                Thời lượng
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                placeholder="Ví dụ: 2h 30m"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Release Date */}
            <div className="space-y-2">
              <label htmlFor="releaseDate" className="block text-sm font-medium">
                Ngày phát hành
              </label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.releaseDate ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.releaseDate && (
                <p className="text-error-500 text-xs">{errors.releaseDate}</p>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label htmlFor="rating" className="block text-sm font-medium">
                Đánh giá (0-10)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="0"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.rating ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.rating && (
                <p className="text-error-500 text-xs">{errors.rating}</p>
              )}
            </div>

            {/* Trailer URL */}
            <div className="space-y-2">
              <label htmlFor="trailerUrl" className="block text-sm font-medium">
                URL Trailer
              </label>
              <input
                type="text"
                id="trailerUrl"
                name="trailerUrl"
                value={formData.trailerUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Upcoming */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="upcoming"
                name="upcoming"
                checked={formData.upcoming}
                onChange={handleChange}
                className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="upcoming" className="text-sm font-medium">
                Phim sắp chiếu
              </label>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-2 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
            <label className="block text-sm font-medium">Thể loại</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.genres.map((genre) => (
                <div 
                  key={genre}
                  className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span>{genre}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="text-primary-400 hover:text-error-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.genres.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Chưa có thể loại nào
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddGenre)}
                placeholder="Thêm thể loại"
                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddGenre}
                className="btn btn-secondary"
              >
                Thêm
              </button>
            </div>
            {errors.genres && (
              <p className="text-error-500 text-xs mt-1">{errors.genres}</p>
            )}
          </div>

          {/* Cast */}
          <div className="space-y-2 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
            <label className="block text-sm font-medium">Diễn viên</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.cast.map((castMember) => (
                <div 
                  key={castMember}
                  className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span>{castMember}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveCastMember(castMember)}
                    className="text-gray-500 hover:text-error-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.cast.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Chưa có diễn viên nào
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={castInput}
                onChange={(e) => setCastInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddCastMember)}
                placeholder="Thêm diễn viên"
                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddCastMember}
                className="btn btn-secondary"
              >
                Thêm
              </button>
            </div>
          </div>

          {/* Showtimes */}
          <div className="space-y-4 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Lịch chiếu phim</label>
              <button
                type="button"
                onClick={handleAddShowtime}
                className="btn btn-primary btn-sm flex items-center gap-1"
              >
                <Plus size={16} />
                <span>Thêm suất chiếu</span>
              </button>
            </div>
            
            {showtimes.length === 0 ? (
              <div className="text-center py-8">
                <Clock size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Chưa có suất chiếu nào</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Nhấn nút "Thêm suất chiếu" để thêm lịch chiếu phim</p>
              </div>
            ) : (
              <div className="space-y-4">
                {showtimes.map((showtime, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveShowtime(index)}
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 hover:text-error-500"
                    >
                      <Trash size={16} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {/* Theater */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Rạp chiếu phim</label>
                        <select
                          value={showtime.theaterId}
                          onChange={(e) => handleShowtimeChange(index, 'theaterId', parseInt(e.target.value))}
                          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                            showtimeErrors[index]?.theaterId ? 'border-2 border-error-500' : ''
                          }`}
                        >
                          <option value="0">Chọn rạp chiếu phim</option>
                          {theaters.map(theater => (
                            <option key={theater.id} value={theater.id}>{theater.name}</option>
                          ))}
                        </select>
                        {showtimeErrors[index]?.theaterId && (
                          <p className="text-error-500 text-xs">{showtimeErrors[index].theaterId}</p>
                        )}
                      </div>
                      
                      {/* Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Ngày chiếu</label>
                        <input
                          type="date"
                          value={showtime.date}
                          onChange={(e) => handleShowtimeChange(index, 'date', e.target.value)}
                          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                            showtimeErrors[index]?.date ? 'border-2 border-error-500' : ''
                          }`}
                        />
                        {showtimeErrors[index]?.date && (
                          <p className="text-error-500 text-xs">{showtimeErrors[index].date}</p>
                        )}
                      </div>
                      
                      {/* Time */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Giờ chiếu</label>
                        <input
                          type="time"
                          value={showtime.time}
                          onChange={(e) => handleShowtimeChange(index, 'time', e.target.value)}
                          className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                            showtimeErrors[index]?.time ? 'border-2 border-error-500' : ''
                          }`}
                        />
                        {showtimeErrors[index]?.time && (
                          <p className="text-error-500 text-xs">{showtimeErrors[index].time}</p>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Giá vé</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={showtime.price}
                            onChange={(e) => handleShowtimeChange(index, 'price', parseFloat(e.target.value))}
                            className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                              showtimeErrors[index]?.price ? 'border-2 border-error-500' : ''
                            }`}
                          />
                        </div>
                        {showtimeErrors[index]?.price && (
                          <p className="text-error-500 text-xs">{showtimeErrors[index].price}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <label htmlFor="synopsis" className="block text-sm font-medium">
              Tóm tắt nội dung
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              rows={4}
              value={formData.synopsis}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
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
              {movie ? 'Cập nhật' : 'Thêm phim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm; 