import React, { useState, useEffect } from 'react';
import type { Movie, Showtime, Genre, MovieGenre, Actor } from '../../types/global-types';
import { X, Plus, Trash, Clock } from 'lucide-react';
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
                Tên phim <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 ${
                  errors.title ? 'border-error-500 focus:ring-error-500' : ''
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
                className={`w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 ${
                  errors.director ? 'border-error-500 focus:ring-error-500' : ''
                }`}
                placeholder="Nhập tên đạo diễn"
              />
              {errors.director && (
                <p className="text-error-500 text-sm">{errors.director}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium">
                Thời lượng
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Ví dụ: 2h 30m"
              />
            </div>

            {/* Release Date */}
            <div className="space-y-2">
              <label htmlFor="releaseDate" className="block text-sm font-medium">
                Ngày phát hành <span className="text-error-500">*</span>
              </label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 ${
                  errors.releaseDate ? 'border-error-500 focus:ring-error-500' : ''
                }`}
              />
              {errors.releaseDate && (
                <p className="text-error-500 text-sm">{errors.releaseDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={`w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 ${
                  errors.rating ? 'border-error-500 focus:ring-error-500' : ''
                }`}
              />
              {errors.rating && (
                <p className="text-error-500 text-sm">{errors.rating}</p>
              )}
            </div>

            {/* Upcoming */}
            <div className="flex items-center h-full mt-8">
              <input
                type="checkbox"
                id="upcoming"
                name="upcoming"
                checked={formData.upcoming}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="upcoming" className="ml-2 block text-sm">
                Đánh dấu là phim sắp chiếu
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trailer URL */}
            <div className="space-y-2">
              <label htmlFor="trailerUrl" className="block text-sm font-medium">
                URL Trailer
              </label>
              <input
                type="url"
                id="trailerUrl"
                name="trailerUrl"
                value={formData.trailerUrl}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                placeholder="https://www.youtube.com/watch?v="
              />
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Thể loại <span className="text-error-500">*</span>
              </label>
              <div className="flex">
                <select
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  className="flex-1 rounded-l-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600"
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
                  className="px-4 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
                >
                  <Plus size={16} />
                </button>
              </div>
              {errors.genres && (
                <p className="text-error-500 text-sm">{errors.genres}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {getGenreNames(formData.genres).map((genreName, index) => (
                  <span
                    key={`genre-${index}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700"
                  >
                    {genreName}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genreName)}
                      className="ml-1.5 text-gray-500 hover:text-error-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cast */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="block text-sm font-medium">
                Diễn viên
              </label>
              <div className="flex">
                <select
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  className="flex-1 rounded-l-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600"
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
                  className="px-4 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.cast.map((castMember, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700"
                  >
                    {castMember}
                    <button
                      type="button"
                      onClick={() => handleRemoveCastMember(castMember)}
                      className="ml-1.5 text-gray-500 hover:text-error-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
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
              className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Nhập tóm tắt nội dung phim"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poster Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Poster phim <span className="text-error-500">*</span>
              </label>
              <ImageUpload
                initialImage={formData.posterPath}
                onImageSelect={handlePosterChange}
              />
              {errors.posterPath && (
                <p className="text-error-500 text-sm">{errors.posterPath}</p>
              )}
            </div>

            {/* Backdrop Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Ảnh nền (backdrop)
              </label>
              <ImageUpload
                initialImage={formData.backdropPath}
                onImageSelect={handleBackdropChange}
              />
            </div>
          </div>

          {/* Showtimes Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Suất chiếu</h3>
              <button
                type="button"
                onClick={handleAddShowtime}
                className="btn btn-primary btn-sm flex items-center gap-1.5"
              >
                <Plus size={16} />
                Thêm suất chiếu
              </button>
            </div>

            {showtimes.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chưa có suất chiếu nào cho phim này.
              </p>
            )}

            {showtimes.map((showtime, index) => (
              <div
                key={index}
                className="glass-card p-4 rounded-lg mb-3 relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveShowtime(index)}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-error-500"
                >
                  <Trash size={16} />
                </button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Theater */}
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Rạp chiếu <span className="text-error-500">*</span>
                    </label>
                    <select
                      value={showtime.theaterId}
                      onChange={(e) => handleShowtimeChange(index, 'theaterId', Number(e.target.value))}
                      className={`w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-sm ${
                        showtimeErrors[index]?.theaterId ? 'border-error-500 focus:ring-error-500' : ''
                      }`}
                    >
                      <option value="">Chọn rạp chiếu</option>
                      {theaters.map((theater) => (
                        <option key={theater.id} value={theater.id}>
                          {theater.name}
                        </option>
                      ))}
                    </select>
                    {showtimeErrors[index]?.theaterId && (
                      <p className="text-error-500 text-xs mt-1">{showtimeErrors[index].theaterId}</p>
                    )}
                  </div>
                  
                  {/* Date */}
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Ngày chiếu <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={showtime.date}
                      onChange={(e) => handleShowtimeChange(index, 'date', e.target.value)}
                      className={`w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-sm ${
                        showtimeErrors[index]?.date ? 'border-error-500 focus:ring-error-500' : ''
                      }`}
                    />
                    {showtimeErrors[index]?.date && (
                      <p className="text-error-500 text-xs mt-1">{showtimeErrors[index].date}</p>
                    )}
                  </div>
                  
                  {/* Time */}
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Giờ chiếu <span className="text-error-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <input
                        type="time"
                        value={showtime.time}
                        onChange={(e) => handleShowtimeChange(index, 'time', e.target.value)}
                        className={`w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-sm ${
                          showtimeErrors[index]?.time ? 'border-error-500 focus:ring-error-500' : ''
                        }`}
                      />
                    </div>
                    {showtimeErrors[index]?.time && (
                      <p className="text-error-500 text-xs mt-1">{showtimeErrors[index].time}</p>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Giá vé <span className="text-error-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">₫</span>
                      <input
                        type="number"
                        value={showtime.price}
                        onChange={(e) => handleShowtimeChange(index, 'price', Number(e.target.value))}
                        className={`w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-sm ${
                          showtimeErrors[index]?.price ? 'border-error-500 focus:ring-error-500' : ''
                        }`}
                        min="0"
                        step="1000"
                      />
                    </div>
                    {showtimeErrors[index]?.price && (
                      <p className="text-error-500 text-xs mt-1">{showtimeErrors[index].price}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              {movie ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm; 