import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Star, Clock, Calendar, ChevronDown, ChevronUp, Plus, Trash, Edit, Film } from "lucide-react";
import MovieForm from "../components/movies/MovieForm";
import MovieDetail from "../components/movies/MovieDetail";
import DeleteConfirmation from "../components/DeleteConfirmation";
import type { Movie, Showtime, Genre, MovieGenre } from "../types/global-types";
import useQuery from "../hooks/useQuery";
import ServiceApi from "../services/api";
import { formatDateTime } from "../types/format-datetime";

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"title" | "rating" | "releaseDate">("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  
  // CRUD state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [viewingMovie, setViewingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  // Fetch movies from API
  const fetchMovies = async () => {
    try {
      const response = await ServiceApi.get('/movies', {
        params: {
          page: query.page,
          limit: query.limit,
          search: query.search,
          genre: query.genre !== 'all' ? query.genre : undefined,
          sort: query.sort,
          order: query.order,
          upcoming: query.upcoming
        }
      });
      setMovies(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // Khởi tạo query và lấy dữ liệu
  const [query, updateQuery, resetQuery] = useQuery({
    page: 1,
    limit: 10,
    search: searchTerm,
    genre: selectedGenre,
    sort: sortField,
    order: sortDirection,
    upcoming: selectedGenre === "Sắp chiếu" ? true : false,
  });

  // Fetch movies when query changes
  useEffect(() => {
    fetchMovies();
  }, [query]);

  // Helper function to get genre names from MovieGenre objects
  const getGenreNames = (genres: MovieGenre[]): string[] => {
    return genres.map(mg => mg.genre?.name || '').filter(name => name !== '');
  };

  // Get unique genres
  const genres = useMemo(() => {
    const allGenres = movies.flatMap(movie => getGenreNames(movie.genres));
    return ["all", ...Array.from(new Set(allGenres))];
  }, [movies]);

  // Filter and sort movies - this is now mostly handled by the API
  const filteredMovies = useMemo(() => {
    return movies;
  }, [movies]);

  // Toggle sort direction or change sort field
  const handleSort = (field: "title" | "rating" | "releaseDate") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      updateQuery({ order: sortDirection === "asc" ? "desc" : "asc" });
    } else {
      setSortField(field);
      setSortDirection("asc");
      updateQuery({ sort: field, order: "asc" });
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: "title" | "rating" | "releaseDate") => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };
  
  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateQuery({ search: e.target.value });
  };

  // Handle genre change
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    updateQuery({ 
      genre: genre, 
      upcoming: genre === "Sắp chiếu" ? true : false 
    });
  };
  
  // CRUD handlers
  const handleAddMovie = async (movie: Omit<Movie, "id" | "createdAt" | "updatedAt">) => {
    try {
      await ServiceApi.post('/movies', movie);
      setIsAddFormOpen(false);
      await fetchMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };
  
  const handleUpdateMovie = async (movie: Omit<Movie, "id" | "createdAt" | "updatedAt">) => {
    if (!editingMovie) return;
    
    try {
      await ServiceApi.patch(`/movies/${editingMovie.id}`, movie);
      setEditingMovie(null);
      await fetchMovies();
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };
  
  const handleDeleteMovie = async () => {
    if (!deletingMovie) return;
    
    try {
      await ServiceApi.delete(`/movies/${deletingMovie.id}`);
      setDeletingMovie(null);
      await fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100/70 dark:bg-blue-900/30">
            <Film size={24} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Danh sách phim</h1>
        </div>
        <div className="flex items-center mt-4 sm:mt-0 gap-2">
          <button 
            className="btn btn-primary btn-md flex items-center gap-2 hover-lift"
            onClick={() => setIsAddFormOpen(true)}
          >
            <Plus size={16} />
            Thêm phim
          </button>
          <div className="flex items-center gap-2 ml-4">
            <button 
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button 
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-gray-50/80 dark:bg-gray-700/80 border-none focus:ring-2 focus:ring-primary-500/70 transition-all"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex-shrink-0">
            <div className="relative">
              <select
                className="appearance-none bg-gray-50/80 dark:bg-gray-700/80 border-none rounded-xl py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary-500/70 transition-all"
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === "all" ? "Tất cả thể loại" : genre}
                  </option>
                ))}
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredMovies.length === 0 && (
        <div className="col-span-full text-center py-12 glass-card rounded-xl">
          <Film size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Không tìm thấy phim nào</p>
        </div>
      )}

      {viewMode === "grid" && filteredMovies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div 
              key={movie.id} 
              className="card overflow-hidden hover-lift"
              onClick={() => setViewingMovie(movie)}
            >
              <div className="relative aspect-[2/3] overflow-hidden cursor-pointer">
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white rounded-full px-2.5 py-1 text-xs font-medium flex items-center shadow-lg">
                  <Star size={12} fill="#FFD700" className="mr-1" />
                  {movie.rating}
                </div>
                {movie.upcoming && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full px-2.5 py-1 text-xs font-medium shadow-lg">
                    Sắp chiếu
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white line-clamp-1">{movie.title}</h3>
                    <div className="flex gap-1.5">
                      <button 
                        className="p-1.5 bg-white/20 rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMovie(movie);
                        }}
                      >
                        <Edit size={14} className="text-white" />
                      </button>
                      <button 
                        className="p-1.5 bg-white/20 rounded-full hover:bg-error-500/80 backdrop-blur-sm transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingMovie(movie);
                        }}
                      >
                        <Trash size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Clock size={14} className="mr-1" />
                  <span>{movie.duration}</span>
                  <span className="mx-2">•</span>
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDateTime(movie.releaseDate)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {getGenreNames(movie.genres).slice(0, 2).map((genreName, index) => (
                    <span
                      key={`${movie.id}-genre-${index}`}
                      className="px-2.5 py-1 bg-gray-100/80 dark:bg-gray-700/80 rounded-full text-xs font-medium"
                    >
                      {genreName}
                    </span>
                  ))}
                  {movie.genres.length > 2 && (
                    <span className="px-2.5 py-1 bg-gray-100/80 dark:bg-gray-700/80 rounded-full text-xs font-medium">
                      +{movie.genres.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "list" && filteredMovies.length > 0 && (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("title")}
                  >
                    Tên phim
                    {renderSortIndicator("title")}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("releaseDate")}
                  >
                    Ngày phát hành
                    {renderSortIndicator("releaseDate")}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("rating")}
                  >
                    Đánh giá
                    {renderSortIndicator("rating")}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thể loại
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-7 flex-shrink-0 mr-4">
                        <img className="h-10 w-7 object-cover rounded" src={movie.posterPath} alt="" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{movie.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{movie.director}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm">{formatDateTime(movie.releaseDate)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{movie.duration}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star size={14} fill="#FFD700" className="mr-1" />
                      <span className="text-sm">{movie.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {getGenreNames(movie.genres).slice(0, 2).map((genreName, index) => (
                        <span
                          key={`${movie.id}-list-genre-${index}`}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                        >
                          {genreName}
                        </span>
                      ))}
                      {movie.genres.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                          +{movie.genres.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setViewingMovie(movie)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      >
                        <span className="sr-only">View</span>
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => setEditingMovie(movie)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingMovie(movie)}
                        className="p-1.5 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-md transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Movie Form */}
      {isAddFormOpen && (
        <MovieForm
          onSubmit={handleAddMovie}
          onCancel={() => setIsAddFormOpen(false)}
        />
      )}

      {/* Edit Movie Form */}
      {editingMovie && (
        <MovieForm
          movie={editingMovie}
          onSubmit={handleUpdateMovie}
          onCancel={() => setEditingMovie(null)}
        />
      )}

      {/* View Movie Detail */}
      {viewingMovie && (
        <MovieDetail
          movie={viewingMovie}
          onClose={() => setViewingMovie(null)}
          onEdit={() => {
            setEditingMovie(viewingMovie);
            setViewingMovie(null);
          }}
          onDelete={() => {
            setDeletingMovie(viewingMovie);
            setViewingMovie(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingMovie && (
        <DeleteConfirmation
          title="Xóa phim"
          message="Bạn có chắc chắn muốn xóa phim này? Hành động này không thể hoàn tác."
          onConfirm={handleDeleteMovie}
          onCancel={() => setDeletingMovie(null)}
        />
      )}
    </div>
  );
} 