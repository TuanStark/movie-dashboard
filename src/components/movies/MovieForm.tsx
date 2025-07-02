import React, { useState, useEffect } from 'react';
import type { Movie, Showtime, Genre, MovieGenre, Actor } from '../../types/global-types';
import { X, Plus, Trash, Clock, Film, Calendar, Star, Users, Video, Tag } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import ServiceApi from '../../services/api';

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

// Default empty movie object
const emptyMovie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'> = {
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

interface Theater {
  id: number;
  name: string;
  location: string;
}

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
  const [formData, setFormData] = useState<Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>>(emptyMovie);
  const [genreInput, setGenreInput] = useState('');
  const [castInput, setCastInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showtimes, setShowtimes] = useState<ShowtimeInput[]>([]);
  const [showtimeErrors, setShowtimeErrors] = useState<Record<number, Record<string, string>>>({});
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [availableActors, setAvailableActors] = useState<Actor[]>([]);

  // Fetch theaters, genres, and actors
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await ServiceApi.get('/theaters');
        setTheaters(response.data.data.data || []);
      } catch (error) {
        console.error('Error fetching theaters:', error);
      }
    };
    
    const fetchGenres = async () => {
      try {
        const response = await ServiceApi.get('/genres');
        setAvailableGenres(response.data.data.data || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    
    const fetchActors = async () => {
      try {
        const response = await ServiceApi.get('/actors');
        setAvailableActors(response.data.data.data || []);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };
    
    fetchTheaters();
    fetchGenres();
    fetchActors();
  }, []);

  // Helper function to get genre names from MovieGenre objects
  const getGenreNames = (genres: MovieGenre[]): string[] => {
    return genres.map(mg => mg.genre?.name || '').filter(name => name !== '');
  };

  // Helper function to check if a genre already exists
  const genreExists = (name: string): boolean => {
    return getGenreNames(formData.genres).includes(name);
  };

  // Initialize form with movie data if provided (edit mode)
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        genres: movie.genres,
        rating: movie.rating,
        synopsis: movie.synopsis,
        duration: movie.duration,
        director: movie.director,
        cast: movie.cast,
        releaseDate: movie.releaseDate,
        trailerUrl: movie.trailerUrl,
        upcoming: movie.upcoming
      });
      
      // In a real application, you would fetch showtimes for the movie here
      const fetchShowtimes = async () => {
        try {
          const response = await ServiceApi.get(`/showtimes/movie/${movie.id}`);
          const movieShowtimes = response.data.data.data || [];
          
          setShowtimes(movieShowtimes.map((showtime: Showtime) => ({
            theaterId: showtime.theaterId,
            date: showtime.date,
            time: showtime.time,
            price: showtime.price
          })));
        } catch (error) {
          console.error('Error fetching showtimes:', error);
        }
      };
      
      fetchShowtimes();
    }
  }, [movie]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handlePosterChange = (imageData: string | File) => {
    setFormData({
      ...formData,
      posterPath: typeof imageData === 'string' ? imageData : URL.createObjectURL(imageData)
    });
  };

  const handleBackdropChange = (imageData: string | File) => {
    setFormData({
      ...formData,
      backdropPath: typeof imageData === 'string' ? imageData : URL.createObjectURL(imageData)
    });
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !genreExists(genreInput.trim())) {
      // Find if the genre already exists in our available genres
      const existingGenre = availableGenres.find(g => g.name.toLowerCase() === genreInput.trim().toLowerCase());
      
      // Create new genre object
      const newGenre: MovieGenre = {
        id: 0, // This will be set by the backend
        movieId: movie?.id || 0,
        genreId: existingGenre?.id || 0,
        genre: existingGenre || { id: 0, name: genreInput.trim() }
      };
      
      setFormData({
        ...formData,
        genres: [...formData.genres, newGenre]
      });
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genreName: string) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter(g => g.genre?.name !== genreName)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isMovieValid = validate();
    const areShowtimesValid = validateShowtimes();
    
    if (isMovieValid && areShowtimesValid) {
      try {
        // Submit movie data
        onSubmit(formData);
        
        // If this is a new movie, we'll handle showtimes in the backend
        // If editing, we need to save showtimes separately
        if (movie && showtimes.length > 0) {
          // This would be handled by the backend in a real application
          // For now, we just show a message
          console.log('Would update showtimes:', showtimes);
        }
      } catch (error) {
        console.error('Error saving movie:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" style={{ marginTop: '0px' }}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
              <Film size={24} className="text-primary-500" />
            </div>
            <h2 className="text-xl font-semibold">
              {movie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
            </h2>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              <Film size={20} />
              <h3>Thông tin cơ bản</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Tên phim <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 ${
                    errors.title ? 'border-2 border-error-500' : ''
                  }`}
                  placeholder="Nhập tên phim"
                />
                {errors.title && (
                  <p className="text-error-500 text-sm">{errors.title}</p>
                )}
              </div>

              {/* Director */}
              <div className="space-y-2">
                <label htmlFor="director" className="block text-sm font-medium">
                  Đạo diễn <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  id="director"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 ${
                    errors.director ? 'border-2 border-error-500' : ''
                  }`}
                  placeholder="Nhập tên đạo diễn"
                />
                {errors.director && (
                  <p className="text-error-500 text-sm">{errors.director}</p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label htmlFor="duration" className="block text-sm font-medium">
                  Thời lượng <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
                    placeholder="Ví dụ: 2h 30m"
                  />
                </div>
              </div>

              {/* Release Date */}
              <div className="space-y-2">
                <label htmlFor="releaseDate" className="block text-sm font-medium">
                  Ngày phát hành <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    id="releaseDate"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 ${
                      errors.releaseDate ? 'border-2 border-error-500' : ''
                    }`}
                  />
                </div>
                {errors.releaseDate && (
                  <p className="text-error-500 text-sm">{errors.releaseDate}</p>
                )}
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label htmlFor="rating" className="block text-sm font-medium">
                  Đánh giá (0-10)
                </label>
                <div className="relative">
                  <Star size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 ${
                      errors.rating ? 'border-2 border-error-500' : ''
                    }`}
                    placeholder="Nhập điểm đánh giá"
                  />
                </div>
                {errors.rating && (
                  <p className="text-error-500 text-sm">{errors.rating}</p>
                )}
              </div>

              {/* Trailer URL */}
              <div className="space-y-2">
                <label htmlFor="trailerUrl" className="block text-sm font-medium">
                  URL Trailer
                </label>
                <div className="relative">
                  <Video size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    id="trailerUrl"
                    name="trailerUrl"
                    value={formData.trailerUrl}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
                    placeholder="https://www.youtube.com/watch?v="
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Genres Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              <Tag size={20} />
              <h3>Thể loại</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <select
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Chọn thể loại</option>
                  {availableGenres.map((genre) => (
                    !getGenreNames(formData.genres).includes(genre.name) && (
                      <option key={genre.id} value={genre.name}>
                        {genre.name}
                      </option>
                    )
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddGenre}
                  className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Thêm
                </button>
              </div>
              {errors.genres && (
                <p className="text-error-500 text-sm">{errors.genres}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {getGenreNames(formData.genres).map((genreName, index) => (
                  <span
                    key={`genre-${index}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  >
                    {genreName}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genreName)}
                      className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cast Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              <Users size={20} />
              <h3>Diễn viên</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <select
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Chọn diễn viên</option>
                  {availableActors.map((actor) => (
                    !formData.cast.includes(actor.name) && (
                      <option key={actor.id} value={actor.name}>
                        {actor.name}
                      </option>
                    )
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCastMember}
                  className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cast.map((castMember, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {castMember}
                    <button
                      type="button"
                      onClick={() => handleRemoveCastMember(castMember)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              <div>Tóm tắt nội dung</div>
            </div>
            
            <textarea
              id="synopsis"
              name="synopsis"
              rows={4}
              value={formData.synopsis}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
              placeholder="Nhập tóm tắt nội dung phim"
            />
          </div>

          {/* Images Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
              <div>Hình ảnh</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Poster Image Upload */}
              <div className="space-y-2">
                <ImageUpload
                  initialImage={formData.posterPath}
                  onImageSelect={handlePosterChange}
                  label="Tải lên poster phim"
                  maxSize={1000000}
                  accept="image/jpeg,image/png"
                />
                {errors.posterPath && (
                  <p className="text-error-500 text-sm">{errors.posterPath}</p>
                )}
              </div>

              {/* Backdrop Image Upload */}
              <div className="space-y-2">
                <ImageUpload
                  initialImage={formData.backdropPath}
                  onImageSelect={handleBackdropChange}
                  label="Tải lên ảnh nền"
                  maxSize={2000000}
                  accept="image/jpeg,image/png"
                />
              </div>
            </div>
          </div>

          {/* Upcoming Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="upcoming"
              name="upcoming"
              checked={formData.upcoming}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
            />
            <label htmlFor="upcoming" className="text-sm font-medium">
              Đánh dấu là phim sắp chiếu
            </label>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {movie ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm; 