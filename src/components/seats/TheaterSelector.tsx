import React from 'react';
import { X, Building2, MapPin, Armchair } from 'lucide-react';
import type { Theater } from '../../types/global-types';

interface TheaterSelectorProps {
  theaters: Theater[];
  onSelect: (theater: Theater) => void;
  onClose: () => void;
}

const TheaterSelector: React.FC<TheaterSelectorProps> = ({ theaters, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="text-blue-500" />
            Chọn rạp để quản lý ghế
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theaters.map((theater) => (
              <div
                key={theater.id}
                onClick={() => onSelect(theater)}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all hover:shadow-md group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={theater.logo}
                    alt={theater.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {theater.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin size={14} className="mr-1" />
                      {theater.location}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Armchair size={14} className="mr-1" />
                        Quản lý ghế
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        Chọn →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {theaters.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">
                Không có rạp nào được tìm thấy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheaterSelector;
