import React, { useState } from 'react';
import { useTheaters } from '../contexts/TheaterContext';
import { Search, Plus, MapPin, MoreVertical, Edit, Trash, Building2, Globe, Map } from 'lucide-react';
import TheaterForm from '../components/TheaterForm';
import TheaterDetail from '../components/TheaterDetail';
import DeleteConfirmation from '../components/DeleteConfirmation';

const Theaters: React.FC = () => {
  const { theaters, addTheater, updateTheater, deleteTheater, getTheater } = useTheaters();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTheaterId, setEditingTheaterId] = useState<number | null>(null);
  const [viewingTheaterId, setViewingTheaterId] = useState<number | null>(null);
  const [deletingTheaterId, setDeletingTheaterId] = useState<number | null>(null);

  // Lọc theaters theo tìm kiếm
  const filteredTheaters = theaters.filter(theater => {
    const searchLower = searchTerm.toLowerCase();
    return (
      theater.name.toLowerCase().includes(searchLower) ||
      theater.location.toLowerCase().includes(searchLower)
    );
  });

  const handleAddTheater = (theaterData: Omit<typeof theaters[0], 'id'>) => {
    addTheater(theaterData);
    setShowAddForm(false);
  };

  const handleUpdateTheater = (id: number, theaterData: Omit<typeof theaters[0], 'id'>) => {
    updateTheater(id, theaterData);
    setEditingTheaterId(null);
  };

  const handleDeleteTheater = () => {
    if (deletingTheaterId !== null) {
      deleteTheater(deletingTheaterId);
      setDeletingTheaterId(null);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100/70 dark:bg-purple-900/30">
            <Building2 size={24} className="text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Quản lý rạp chiếu phim</h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center gap-2 hover-lift"
        >
          <Plus size={18} />
          <span>Thêm rạp chiếu phim</span>
        </button>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm rạp chiếu phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-none rounded-xl bg-gray-50/80 dark:bg-gray-700/80 focus:ring-2 focus:ring-primary-500/70 transition-all"
            />
          </div>
        </div>

        {/* Theaters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheaters.length > 0 ? (
            filteredTheaters.map((theater) => (
              <div 
                key={theater.id} 
                className="card overflow-hidden hover-lift"
                onClick={() => setViewingTheaterId(theater.id)}
              >
                {/* Map Preview Placeholder */}
                <div className="h-32 bg-gradient-to-r from-purple-400/20 to-blue-400/20 dark:from-purple-900/30 dark:to-blue-900/30 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe size={40} className="text-purple-300 dark:text-purple-700" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <h3 className="font-semibold text-lg text-white">{theater.name}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin size={18} className="mt-0.5 flex-shrink-0 text-purple-500" />
                      <p className="text-sm">{theater.location}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTheaterId(theater.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingTheaterId(theater.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-error-50 dark:hover:bg-error-900/20 text-error-500 transition-colors"
                        title="Xóa"
                      >
                        <Trash size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingTheaterId(theater.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Xem chi tiết"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50/80 dark:bg-gray-700/80 p-3 rounded-xl text-sm mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Map size={16} className="text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tọa độ</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Lat</p>
                        <p className="font-mono text-xs">{theater.coordinates.lat.toFixed(6)}</p>
                      </div>
                      <div className="bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Lng</p>
                        <p className="font-mono text-xs">{theater.coordinates.lng.toFixed(6)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 glass-card rounded-xl">
              <Building2 size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy rạp chiếu phim nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Theater Form */}
      {showAddForm && (
        <TheaterForm
          onSubmit={handleAddTheater}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Theater Form */}
      {editingTheaterId !== null && (
        <TheaterForm
          theater={getTheater(editingTheaterId)}
          onSubmit={(theaterData) => handleUpdateTheater(editingTheaterId, theaterData)}
          onCancel={() => setEditingTheaterId(null)}
        />
      )}

      {/* View Theater Detail */}
      {viewingTheaterId !== null && (
        <TheaterDetail
          theater={getTheater(viewingTheaterId)!}
          onClose={() => setViewingTheaterId(null)}
          onEdit={() => {
            setEditingTheaterId(viewingTheaterId);
            setViewingTheaterId(null);
          }}
          onDelete={() => {
            setDeletingTheaterId(viewingTheaterId);
            setViewingTheaterId(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingTheaterId !== null && (
        <DeleteConfirmation
          title="Xóa rạp chiếu phim"
          message="Bạn có chắc chắn muốn xóa rạp chiếu phim này? Hành động này không thể hoàn tác."
          onConfirm={handleDeleteTheater}
          onCancel={() => setDeletingTheaterId(null)}
        />
      )}
    </div>
  );
};

export default Theaters; 