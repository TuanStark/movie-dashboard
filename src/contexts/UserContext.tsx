import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { users as initialUsers } from '../data/mock-data';
import type { User } from '../data/mock-data';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, updatedUser: Omit<User, 'id'>) => void;
  deleteUser: (id: number) => void;
  getUser: (id: number) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from localStorage or use initial data
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
    }
  }, []);

  // Save to localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const addUser = (user: Omit<User, 'id'>) => {
    // Generate a new ID (highest ID + 1)
    const newId = users.length > 0 
      ? Math.max(...users.map(u => u.id)) + 1 
      : 1;
    
    const newUser = {
      ...user,
      id: newId
    };
    
    setUsers([...users, newUser]);
  };

  const updateUser = (id: number, updatedUser: Omit<User, 'id'>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...updatedUser, id } : user
    ));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const getUser = (id: number) => {
    return users.find(user => user.id === id);
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      deleteUser,
      getUser
    }}>
      {children}
    </UserContext.Provider>
  );
}; 