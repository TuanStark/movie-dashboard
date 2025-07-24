import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import SeatHeader from '../components/seats/SeatHeader';
import SeatMap from '../components/seats/SeatMap';
import SeatStats from '../components/seats/SeatStats';
import SeatModals from '../components/seats/SeatModals';
import ServiceApi from '../services/api';
import type { Seat, Theater } from '../types/global-types';

const Seats: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Theater-specific management
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showTheaterSelector, setShowTheaterSelector] = useState(false);
  const [theaterSeats, setTheaterSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showBulkForm, setShowBulkForm] = useState(false);



  // Fetch theaters for filter
  const fetchTheaters = async () => {
    try {
      const response = await ServiceApi.get('/theaters');
      setTheaters(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  // Fetch seats by theater
  const fetchSeatsByTheater = async (theaterId: number) => {
    try {
      const response = await ServiceApi.get(`/seats/theater/${theaterId}`);
      console.log(response.data.data);
      setTheaterSeats(response.data.data || []);
    } catch (error) {
      console.error('Error fetching theater seats:', error);
    }
  };

  // Handle theater selection
  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater);
    setShowTheaterSelector(false);
    fetchSeatsByTheater(theater.id);
  };

  // Handle bulk seat creation
  const handleBulkCreateSeats = async (theaterData: {
    theaterId: number;
    rows: string[];
    seatsPerRow: number;
    type: string;
    price: number;
  }) => {
    try {
      await ServiceApi.post('/seats/bulk', theaterData);
      if (selectedTheater) {
        await fetchSeatsByTheater(selectedTheater.id);
      }
    } catch (error) {
      console.error('Error creating bulk seats:', error);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedSeats.length === 0) return;

    try {
      await ServiceApi.delete('/seats/bulk', { data: { seatIds: selectedSeats } });
      if (selectedTheater) {
        await fetchSeatsByTheater(selectedTheater.id);
      }
      setSelectedSeats([]);
    } catch (error) {
      console.error('Error deleting bulk seats:', error);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleAdd = () => {
    setSelectedSeat(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (seat: Seat) => {
    setSelectedSeat(seat);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (seat: Seat) => {
    setSelectedSeat(seat);
    setShowDeleteConfirm(true);
  };

  const handleView = (seat: Seat) => {
    setSelectedSeat(seat);
    setShowDetail(true);
  };

  const handleSubmit = async (seatData: Omit<Seat, 'id'>) => {
    try {
      if (isEditing && selectedSeat) {
        await ServiceApi.patch(`/seats/${selectedSeat.id}`, seatData);
      } else {
        await ServiceApi.post('/seats', seatData);
      }
      if (selectedTheater) {
        await fetchSeatsByTheater(selectedTheater.id);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving seat:', error);
    }
  };

  const confirmDelete = async () => {
    if (selectedSeat) {
      try {
        await ServiceApi.delete(`/seats/${selectedSeat.id}`);
        if (selectedTheater) {
          await fetchSeatsByTheater(selectedTheater.id);
        }
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error('Error deleting seat:', error);
      }
    }
  };



  return (
    <div className="p-6">
      {/* Header */}
      <SeatHeader
        selectedTheater={selectedTheater}
        selectedSeats={selectedSeats}
        onTheaterSelect={() => setShowTheaterSelector(true)}
        onBulkDelete={handleBulkDelete}
        onBulkCreate={() => setShowBulkForm(true)}
        onAddSeat={handleAdd}
      />

      {/* Filters */}
      {/* <SeatFilters
        query={query}
        theaters={theaters}
        onQueryUpdate={updateQuery}
      /> */}

      {/* Theater Stats */}
      {selectedTheater && theaterSeats.length > 0 && (
        <div className="mb-6">
          <SeatStats theater={selectedTheater} seats={theaterSeats} />
        </div>
      )}

      {/* Seat Map View */}
      {selectedTheater ? (
        <SeatMap
          seats={theaterSeats}
          selectedSeats={selectedSeats}
          onSeatSelect={(seatId) => {
            setSelectedSeats(prev =>
              prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
            );
          }}
          onSeatEdit={handleEdit}
          onSeatView={handleView}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <Building2 className="mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2">Chọn rạp để bắt đầu</h3>
            <p className="text-sm">Vui lòng chọn một rạp để xem và quản lý ghế ngồi</p>
            <button
              onClick={() => setShowTheaterSelector(true)}
              className="btn btn-primary mt-4"
            >
              Chọn rạp
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <SeatModals
        showForm={showForm}
        showDetail={showDetail}
        showTheaterSelector={showTheaterSelector}
        showBulkForm={showBulkForm}
        showDeleteConfirm={showDeleteConfirm}
        selectedSeat={selectedSeat}
        selectedTheater={selectedTheater}
        theaters={theaters}
        isEditing={isEditing}
        onFormSubmit={handleSubmit}
        onFormCancel={() => setShowForm(false)}
        onDetailClose={() => setShowDetail(false)}
        onDetailEdit={() => {
          setShowDetail(false);
          handleEdit(selectedSeat!);
        }}
        onDetailDelete={() => {
          setShowDetail(false);
          handleDelete(selectedSeat!);
        }}
        onTheaterSelect={handleTheaterSelect}
        onTheaterSelectorClose={() => setShowTheaterSelector(false)}
        onBulkSubmit={handleBulkCreateSeats}
        onBulkCancel={() => setShowBulkForm(false)}
        onDeleteConfirm={confirmDelete}
        onDeleteCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default Seats;
