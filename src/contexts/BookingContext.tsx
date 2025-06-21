import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import { bookings as initialBookings } from "../data/mock-data";
import type { Booking } from "../data/mock-data";

interface BookingContextType {
  bookings: Booking[];
  getBooking: (id: number) => Booking | undefined;
  updateBookingStatus: (id: number, status: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    // Add status field to each booking
    return initialBookings.map(booking => ({
      ...booking,
      status: "confirmed" // Default status
    }));
  });

  const getBooking = (id: number) => {
    return bookings.find(booking => booking.id === id);
  };

  const updateBookingStatus = (id: number, status: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  return (
    <BookingContext.Provider value={{ bookings, getBooking, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
}; 