import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Trash, Edit, Film, ChevronDown, ChevronUp, Calendar, List } from "lucide-react";
import GenreForm from "../components/genres/GenreForm";
import DeleteConfirmation from "../components/DeleteConfirmation";
import useQuery from "../hooks/useQuery";
import ServiceApi from "../services/api";

export interface Genre {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Genres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "createdAt">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // CRUD state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);

  // Initialize query
  const [query] = useQuery({
    page: 1,
    limit: 10,
    search: searchTerm,
    sort: sortField,
    order: sortDirection,
  });

  // Fetch genres
  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await ServiceApi.get('/genres', { params: query });
      
      // Extract genres from response
      const responseData = response.data;
      let genresData = [];
      
      // Handle different response structures
      if (Array.isArray(responseData)) {
        genresData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        genresData = responseData.data;
      } else if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
        genresData = responseData.data.data;
      }
      
      setGenres(genresData);
      setError(null);
    } catch (err) {
      console.error('Error fetching genres:', err);
      setError('Failed to fetch genres. Please try again.');
      setGenres([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGenres();
  }, [query]);

  // Filter genres
  const filteredGenres = useMemo(() => {
    if (!Array.isArray(genres)) {
      return [];
    }
    
    return genres.filter(genre => 
      genre?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? (a.name || '').localeCompare(b.name || '')
          : (b.name || '').localeCompare(a.name || '');
      } else {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  }, [genres, searchTerm, sortField, sortDirection]);

  // Toggle sort direction or change sort field
  const handleSort = (field: "name" | "createdAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: "name" | "createdAt") => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // CRUD handlers
  const handleAddGenre = async (genreData: Omit<Genre, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await ServiceApi.post('/genres', genreData);
      setGenres([...genres, response.data.data]);
      setIsAddFormOpen(false);
    } catch (err) {
      console.error('Error adding genre:', err);
      setError('Failed to add genre. Please try again.');
    }
  };

  const handleUpdateGenre = async (genreData: Omit<Genre, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingGenre) return;
    
    try {
      const response = await ServiceApi.put(`/genres/${editingGenre.id}`, genreData);
      setGenres(genres.map(genre => 
        genre.id === editingGenre.id ? response.data.data : genre
      ));
      setEditingGenre(null);
    } catch (err) {
      console.error('Error updating genre:', err);
      setError('Failed to update genre. Please try again.');
    }
  };

  const handleDeleteGenre = async () => {
    if (!deletingGenre) return;
    
    try {
      await ServiceApi.delete(`/genres/${deletingGenre.id}`);
      setGenres(genres.filter(genre => genre.id !== deletingGenre.id));
      setDeletingGenre(null);
    } catch (err) {
      console.error('Error deleting genre:', err);
      setError('Failed to delete genre. Please try again.');
    }
  };

  if (loading && genres.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchGenres}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100/70 dark:bg-blue-900/30">
            <List size={24} className="text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Quản lý Thể loại Phim</h1>
        </div>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="btn btn-primary flex items-center gap-2 hover-lift"
        >
          <Plus size={18} />
          <span>Thêm thể loại</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm thể loại..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Tên thể loại
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Ngày tạo
                    {renderSortIndicator('createdAt')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGenres.length > 0 ? (
                filteredGenres.map((genre) => (
                  <tr key={genre.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Film className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{genre.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(genre.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingGenre(genre)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeletingGenre(genre)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy thể loại nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Genre Form Modal */}
      {(isAddFormOpen || editingGenre) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingGenre ? 'Chỉnh sửa Thể loại' : 'Thêm Thể loại Mới'}
              </h2>
              <GenreForm
                initialData={editingGenre}
                onSubmit={editingGenre ? handleUpdateGenre : handleAddGenre}
                onCancel={() => {
                  setEditingGenre(null);
                  setIsAddFormOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGenre && (
        <DeleteConfirmation
          onCancel={() => setDeletingGenre(null)}
          onConfirm={handleDeleteGenre}
          title="Xác nhận xóa thể loại"
          message={`Bạn có chắc chắn muốn xóa thể loại "${deletingGenre?.name}"? Hành động này không thể hoàn tác.`}
        />
      )}
    </div>
  );
}
