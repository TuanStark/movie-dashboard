import { useState, useEffect } from "react";
import { Search, Plus, Trash, Edit, User, X, Loader2 } from "lucide-react";
import ActorForm from "../components/actors/ActorForm";
import DeleteConfirmation from "../components/DeleteConfirmation";
import useQuery from "../hooks/useQuery";
import ServiceApi from "../services/api";
import type { Actor } from "../types/global-types";

export default function Actors() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingActor, setEditingActor] = useState<Actor | null>(null);
  const [deletingActor, setDeletingActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query] = useQuery({
    page: 1,
    limit: 10,
    search: searchTerm,
    // sort: sortField,
    // order: sortDirection,
  });

  // Fetch actors
  const fetchActors = async () => {
    try {
      setLoading(true);
      const response = await ServiceApi.get('/actors', { params: query });

      // Extract actors from response
      const responseData = response.data;
      let actorsData: Actor[] = [];

      if (Array.isArray(responseData)) {
        actorsData = responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        actorsData = responseData.data;
      } else if (responseData.data && responseData.data.data) {
        actorsData = responseData.data.data;
      }

      setActors(actorsData);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách diễn viên. Vui lòng thử lại sau.');
      setActors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, [query]);

  // Filter actors
  const filteredActors = actors.filter(actor =>
    actor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddActor = async (actorData: Omit<Actor, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Don't add to actors array yet - wait for the API response
      setIsAddFormOpen(false);
      await fetchActors(); // Refresh the list after adding
    } catch (err) {
      console.error('Error adding actor:', err);
      setError('Không thể thêm diễn viên. Vui lòng thử lại.');
    }
  };

  const handleUpdateActor = async (actorData: Omit<Actor, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingActor) return;

    try {
      // Don't update actors array yet - wait for the API response
      setEditingActor(null);
      await fetchActors(); // Refresh the list after updating
    } catch (err) {
      console.error('Error updating actor:', err);
      setError('Không thể cập nhật diễn viên. Vui lòng thử lại.');
    }
  };

  const handleDeleteActor = async () => {
    if (!deletingActor) return;

    try {
      await ServiceApi.delete(`/actors/${deletingActor.id}`);
      setActors(actors.filter(actor => actor.id !== deletingActor.id));
      setDeletingActor(null);
      await fetchActors();
    } catch (err) {
      console.error('Error deleting actor:', err);
      setError('Không thể xóa diễn viên. Vui lòng thử lại.');
    }
  };

  if (loading && actors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100/70 dark:bg-purple-900/30">
            <User size={24} className="text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Quản lý Diễn viên</h1>
        </div>
        <button
          onClick={() => {
            setEditingActor(null);
            setIsAddFormOpen(true);
          }}
          className="btn btn-primary flex items-center gap-2 hover-lift"
        >
          <Plus size={18} />
          <span>Thêm diễn viên</span>
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tìm kiếm diễn viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredActors.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có diễn viên nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bắt đầu bằng cách thêm một diễn viên mới.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsAddFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Thêm diễn viên
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredActors.map((actor) => (
              <div key={actor.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  {actor.photo ? (
                    <img
                      src={actor.photo}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{actor.name}</h3>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingActor(actor)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeletingActor(actor)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Actor Form Modal */}
      {(isAddFormOpen || editingActor) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingActor ? 'Chỉnh sửa Diễn viên' : 'Thêm Diễn viên Mới'}
              </h2>
              <ActorForm
                actor={editingActor || undefined}
                onSubmit={editingActor ? handleUpdateActor : handleAddActor}
                onCancel={() => {
                  setEditingActor(null);
                  setIsAddFormOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingActor && (
        <DeleteConfirmation
          title="Xóa diễn viên"
          message={`Bạn có chắc chắn muốn xóa diễn viên "${deletingActor.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDeleteActor}
          onCancel={() => setDeletingActor(null)}
        />
      )}
    </div>
  );
}
