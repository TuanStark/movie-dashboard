import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { theaters as initialTheaters } from '../data/mock-data';
import type { Theater } from '../data/mock-data';

interface TheaterContextType {
  theaters: Theater[];
  addTheater: (theater: Omit<Theater, 'id'>) => void;
  updateTheater: (id: number, updatedTheater: Omit<Theater, 'id'>) => void;
  deleteTheater: (id: number) => void;
  getTheater: (id: number) => Theater | undefined;
}

const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

export const useTheaters = () => {
  const context = useContext(TheaterContext);
  if (!context) {
    throw new Error('useTheaters must be used within a TheaterProvider');
  }
  return context;
};

interface TheaterProviderProps {
  children: ReactNode;
}

export const TheaterProvider: React.FC<TheaterProviderProps> = ({ children }) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);

  useEffect(() => {
    // Load theaters from localStorage or use initial data
    const savedTheaters = localStorage.getItem('theaters');
    if (savedTheaters) {
      setTheaters(JSON.parse(savedTheaters));
    } else {
      setTheaters(initialTheaters);
    }
  }, []);

  // Save to localStorage whenever theaters change
  useEffect(() => {
    if (theaters.length > 0) {
      localStorage.setItem('theaters', JSON.stringify(theaters));
    }
  }, [theaters]);

  const addTheater = (theater: Omit<Theater, 'id'>) => {
    // Generate a new ID (highest ID + 1)
    const newId = theaters.length > 0 
      ? Math.max(...theaters.map(t => t.id)) + 1 
      : 1;
    
    const newTheater = {
      ...theater,
      id: newId
    };
    
    setTheaters([...theaters, newTheater]);
  };

  const updateTheater = (id: number, updatedTheater: Omit<Theater, 'id'>) => {
    setTheaters(theaters.map(theater => 
      theater.id === id ? { ...updatedTheater, id } : theater
    ));
  };

  const deleteTheater = (id: number) => {
    setTheaters(theaters.filter(theater => theater.id !== id));
  };

  const getTheater = (id: number) => {
    return theaters.find(theater => theater.id === id);
  };

  return (
    <TheaterContext.Provider value={{ 
      theaters, 
      addTheater, 
      updateTheater, 
      deleteTheater,
      getTheater
    }}>
      {children}
    </TheaterContext.Provider>
  );
}; 