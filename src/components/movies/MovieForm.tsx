import React, { useState, useEffect } from 'react';
import type { Movie, Showtime, Genre, MovieGenre, Actor, ShowtimeInput, Theater } from '../../types/global-types';
import { X, Plus, Clock, Film, Calendar, Star, Video, Tag, MapPin, Globe } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import ServiceApi from '../../services/api';

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

// Define the form data interface with file fields
interface MovieFormData extends Omit<Movie, 'id' | 'createdAt' | 'updatedAt'> {
  posterFile: File | null;
  backdropFile: File | null;
}

// Default empty movie object
const emptyMovie: MovieFormData = {
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
  upcoming: false,
  writer: '',
  language: '',
  country: '',
  actors: 'actorsTest',
  posterFile: null,
  backdropFile: null
};

// const defaultShowtime: ShowtimeInput = {
//   theaterId: 0,
//   date: '',
//   time: '',
//   price: 0
// };

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<MovieFormData>(emptyMovie);
  const [genreInput, setGenreInput] = useState('');
  const [castInput, setCastInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showtimes, setShowtimes] = useState<ShowtimeInput[]>([]);
  const [showtimeErrors, setShowtimeErrors] = useState<Record<number, Record<string, string>>>({});
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        title: movie.title || '',
        posterPath: movie.posterPath || '',
        backdropPath: movie.backdropPath || '',
        genres: movie.genres || [],
        rating: movie.rating || 0,
        synopsis: movie.synopsis || '',
        duration: movie.duration || '',
        director: movie.director || '',
        cast: movie.cast || [],
        releaseDate: movie.releaseDate || '',
        trailerUrl: movie.trailerUrl || '',
        upcoming: movie.upcoming || false,
        writer: movie.writer || '',
        language: movie.language || '',
        country: movie.country || '',
        actors: movie.actors || 'actorsTest',
        posterFile: null,
        backdropFile: null,
      });
      
      // Only fetch showtimes if we have a movie ID
      if (movie.id) {
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
            // Set empty showtimes array on error
            setShowtimes([]);
          }
        };
        
        fetchShowtimes();
      }
    } else {
      setFormData(emptyMovie);
      setShowtimes([]);
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
    console.log(imageData);
    if (typeof imageData === 'string') {
      setFormData(prev => ({
        ...prev,
        posterPath: imageData || '',
        posterFile: null
      }));
    } else if (imageData instanceof File) {
      setFormData(prev => ({
        ...prev,
        posterFile: imageData,
        posterPath: URL.createObjectURL(imageData)
      }));
    }
  };

  const handleBackdropChange = (imageData: string | File) => {
    if (typeof imageData === 'string') {
      setFormData(prev => ({
        ...prev,
        backdropPath: imageData || '',
        backdropFile: null
      }));
    } else if (imageData instanceof File) {
      setFormData(prev => ({
        ...prev,
        backdropFile: imageData,
        backdropPath: URL.createObjectURL(imageData)
      }));
    }
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
    if (castInput.trim()) {
      // Tìm actor từ danh sách có sẵn
      const selectedActor = availableActors.find(actor => 
        actor.name.toLowerCase() === castInput.trim().toLowerCase()
      );
      
      if (selectedActor && !formData.cast.includes(selectedActor.id)) {
        setFormData(prev => ({
          ...prev,
          cast: [...prev.cast, selectedActor.id]
        }));
      }
      setCastInput('');
    }
  };

  const handleRemoveCastMember = (actorId: number) => {
    setFormData(prev => ({
      ...prev,
      cast: prev.cast.filter(id => id !== actorId)
    }));
  };

  // Xử lý thêm suất chiếu mới
  // const handleAddShowtime = () => {
  //   setShowtimes([...showtimes, { ...defaultShowtime }]);
  // };

  // // Xử lý xóa suất chiếu
  // const handleRemoveShowtime = (index: number) => {
  //   const newShowtimes = [...showtimes];
  //   newShowtimes.splice(index, 1);
  //   setShowtimes(newShowtimes);
    
  //   // Cập nhật lỗi
  //   const newErrors = { ...showtimeErrors };
  //   delete newErrors[index];
  //   setShowtimeErrors(newErrors);
  // };

  // // Xử lý thay đổi thông tin suất chiếu
  // const handleShowtimeChange = (index: number, field: keyof ShowtimeInput, value: string | number) => {
  //   const newShowtimes = [...showtimes];
  //   newShowtimes[index] = {
  //     ...newShowtimes[index],
  //     [field]: value
  //   };
  //   setShowtimes(newShowtimes);
    
  //   // Xóa lỗi khi người dùng sửa
  //   if (showtimeErrors[index] && showtimeErrors[index][field as string]) {
  //     const newErrors = { ...showtimeErrors };
  //     delete newErrors[index][field as string];
  //     if (Object.keys(newErrors[index]).length === 0) {
  //       delete newErrors[index];
  //     }
  //     setShowtimeErrors(newErrors);
  //   }
  // };

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    console.log('Running validation');
    
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên phim';
    }
    
    if (!formData.director.trim()) {
      newErrors.director = 'Vui lòng nhập tên đạo diễn';
    }

    if (!formData.writer?.trim()) {
      newErrors.writer = 'Vui lòng nhập tên tác giả';
    }
    
    if (!formData.duration.trim()) {
      newErrors.duration = 'Vui lòng nhập thời lượng phim';
    }
    
    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Vui lòng chọn ngày khởi chiếu';
    }
    
    if (!formData.synopsis.trim()) {
      newErrors.synopsis = 'Vui lòng nhập tóm tắt phim';
    }
    
    if (!formData.trailerUrl.trim()) {
      newErrors.trailerUrl = 'Vui lòng nhập URL trailer';
    }
    
    if (!formData.posterPath && !formData.posterFile) {
      newErrors.posterPath = 'Vui lòng tải lên poster phim';
    }
    
    if (!formData.backdropPath && !formData.backdropFile) {
      newErrors.backdropPath = 'Vui lòng tải lên ảnh nền';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    
    // Ensure actors has a default value
    if (!formData.actors) {
      setFormData(prev => ({
        ...prev,
        actors: 'actorsTest'
      }));
    }
    
    const isMovieValid = validate();
    const areShowtimesValid = validateShowtimes();
    
    console.log('Validation results:', { isMovieValid, areShowtimesValid });
    console.log('Form data:', formData);
    console.log('Errors:', errors);
    
    if (isMovieValid && areShowtimesValid) {
      try {
        console.log('Starting API call');
        
        // Prepare movie data
        const formDataObj = new FormData();
        // Handle file uploads
        if (formData.posterFile instanceof File) {
          formDataObj.append('posterFile', formData.posterFile);
        }else{
          formDataObj.append('posterPath', formData.posterPath);
        }
        if (formData.backdropFile instanceof File) {
          formDataObj.append('backdropFile', formData.backdropFile);
        }else{
          formDataObj.append('backdropPath', formData.backdropPath);
        }

        formDataObj.append('title', formData.title);
        formDataObj.append('director', formData.director);
        formDataObj.append('duration', formData.duration);
        formDataObj.append('releaseDate', new Date(formData.releaseDate).toISOString());
        formDataObj.append('rating', formData.rating.toString());
        formDataObj.append('trailerUrl', formData.trailerUrl);
        formDataObj.append('upcoming', formData.upcoming.toString());
        formDataObj.append('genreIds', JSON.stringify(formData.genres.map(g => g.genreId)));
        formDataObj.append('castIds', JSON.stringify(formData.cast));
        formDataObj.append('synopsis', formData.synopsis);
        formDataObj.append('writer', formData.writer || 'Unknown');
        formDataObj.append('language', formData.language || '');
        formDataObj.append('country', formData.country || '');
        formDataObj.append('actors', formData.actors);

        console.log('Form data being sent:', Object.fromEntries(formDataObj.entries()));

        // Determine if this is an update or create operation
        const isUpdate = movie && movie.id;
        const url = isUpdate ? `${import.meta.env.VITE_URL}movies/${movie.id}` : `${import.meta.env.VITE_URL}movies`;
        const method = isUpdate ? 'PATCH' : 'POST';
  
        // Send movie data
        const response = await fetch(url, {
          method: method,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formDataObj
        });
        
        console.log('API Response:', response);
        const responseData = await response.json();
        console.log('Response data:', responseData);
  
        if (response.ok) {
          // Success - call onSubmit with the theater data
          onSubmit({
            ...formData,
            genres: formData.genres,
            cast: formData.cast
          });
        } else {
          throw new Error(responseData.message || `Failed to ${isUpdate ? 'update' : 'create'} movie`);
        }
      } catch (error: any) {
        console.error('Error submitting form:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi khi gửi biểu mẫu';
        setErrors(prev => ({ ...prev, form: errorMessage }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     action();
  //   }
  // };

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
                  Đạo diễn
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
                  required
                />
              </div>

              {/* Writer */}
              <div className="space-y-2">
                <label htmlFor="writer" className="block text-sm font-medium">
                  Tác giả <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  id="writer"
                  name="writer"
                  value={formData.writer || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 ${
                    errors.writer ? 'border-2 border-error-500' : ''
                  }`}
                  placeholder="Nhập tên tác giả"
                  required
                />
                {errors.writer && (
                  <p className="text-error-500 text-sm">{errors.writer}</p>
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

                {/* Language */}
              <div className="space-y-2">
                <label htmlFor="language" className="block text-sm font-medium">
                  Ngôn ngữ
                </label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 ${
                      errors.rating ? 'border-2 border-error-500' : ''
                    }`}
                    placeholder="Nhập ngôn ngữ"
                  />
                </div>
                {errors.rating && (
                  <p className="text-error-500 text-sm">{errors.rating}</p>
                )}
              </div>

              {/* country */}
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-medium">
                  Quốc gia
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập quốc gia"
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
                  onClick={() => handleAddGenre()}
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

          {/* Cast Members */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Diễn viên
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.cast.map((actorId) => {
                const actor = availableActors.find(a => a.id === actorId);
                return actor && (
                  <span
                    key={actor.id}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    {actor.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveCastMember(actor.id)}
                      className="p-0.5 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2">
              <select
                value={castInput}
                onChange={(e) => setCastInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Chọn diễn viên</option>
                {availableActors.map((actor) => (
                  !formData.cast.includes(actor.id) && (
                    <option key={actor.id} value={actor.name}>
                      {actor.name}
                    </option>
                  )
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddCastMember}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500"
              >
                <Plus size={20} />
              </button>
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