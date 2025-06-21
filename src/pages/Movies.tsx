import React, { useState, useMemo } from "react";
import { useMovies } from "../contexts/MovieContext";
import { Search, Filter, Star, Clock, Calendar, ChevronDown, ChevronUp, MoreVertical, Plus, Trash, Edit, Film } from "lucide-react";
import MovieForm from "../components/MovieForm";
import MovieDetail from "../components/MovieDetail";
import DeleteConfirmation from "../components/DeleteConfirmation";
import type { Movie, Showtime } from "../data/mock-data";

export default function Movies() {
  const { movies, addMovie, updateMovie, deleteMovie } = useMovies();
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

  // Get unique genres
  const genres = useMemo(() => {
    const allGenres = movies.flatMap(movie => movie.genres);
    return ["all", ...Array.from(new Set(allGenres))];
  }, [movies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             movie.director.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre === "all" || movie.genres.includes(selectedGenre);
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortField === "title") {
          return sortDirection === "asc" 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
        } else if (sortField === "rating") {
          return sortDirection === "asc" 
            ? a.rating - b.rating 
            : b.rating - a.rating;
        } else {
          return sortDirection === "asc" 
            ? new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime() 
            : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        }
      });
  }, [movies, searchTerm, sortField, sortDirection, selectedGenre]);

  // Toggle sort direction or change sort field
  const handleSort = (field: "title" | "rating" | "releaseDate") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: "title" | "rating" | "releaseDate") => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };
  
  // CRUD handlers
  const handleAddMovie = (movie: Omit<Movie, "id">, showtimes: Omit<Showtime, "id">[]) => {
    addMovie(movie as Movie, showtimes);
    setIsAddFormOpen(false);
  };
  
  const handleUpdateMovie = (movie: Omit<Movie, "id">, showtimes: Omit<Showtime, "id">[]) => {
    if (editingMovie) {
      updateMovie(editingMovie.id, movie as Movie, showtimes);
      setEditingMovie(null);
    }
  };
  
  const handleDeleteMovie = () => {
    if (deletingMovie) {
      deleteMovie(deletingMovie.id);
      setDeletingMovie(null);
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <div className="relative">
              <select
                className="appearance-none bg-gray-50/80 dark:bg-gray-700/80 border-none rounded-xl py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary-500/70 transition-all"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
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

      {viewMode === "grid" ? (
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
                  <span>{movie.releaseDate}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {movie.genres.slice(0, 2).map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-gray-100/80 dark:bg-gray-700/80 rounded-full text-xs font-medium"
                    >
                      {genre}
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
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("title")}
                  >
                    Tên phim {renderSortIndicator("title")}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thể loại
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Đạo diễn
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("releaseDate")}
                  >
                    Ngày chiếu {renderSortIndicator("releaseDate")}
                  </button>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("rating")}
                  >
                    Đánh giá {renderSortIndicator("rating")}
                  </button>
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMovies.map((movie) => (
                <tr 
                  key={movie.id} 
                  className="hover:bg-gray-50/90 dark:hover:bg-gray-700/90 transition-colors"
                  onClick={() => setViewingMovie(movie)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-md mr-3 shadow-md"
                      />
                      <div>
                        <div className="font-medium">{movie.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{movie.duration}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {movie.genres.map((genre, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2.5 py-1 text-xs rounded-full bg-gray-100/80 dark:bg-gray-700/80"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">{movie.director}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {movie.upcoming && (
                        <span className="inline-block mr-2 px-2.5 py-1 text-xs rounded-full bg-primary-100/80 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                          Sắp chiếu
                        </span>
                      )}
                      {movie.releaseDate}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Star size={16} fill="#FFD700" className="mr-1 text-yellow-500" />
                      <span>{movie.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setEditingMovie(movie)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="p-1.5 rounded-full hover:bg-error-50 dark:hover:bg-error-900/20 text-error-500 transition-colors"
                        onClick={() => setDeletingMovie(movie)}
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

      {filteredMovies.length === 0 && (
        <div className="text-center py-12 glass-card rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">Không tìm thấy phim phù hợp với tiêu chí tìm kiếm</p>
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
      
      {/* View Movie Details */}
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
          message={`Bạn có chắc chắn muốn xóa phim "${deletingMovie.title}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDeleteMovie}
          onCancel={() => setDeletingMovie(null)}
        />
      )}
    </div>
  );
} 