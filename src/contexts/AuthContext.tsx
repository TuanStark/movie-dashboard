import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../axios';
import ServiceApi from '../services/api';
// Define user types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    avatar?: string;
}

// Define context types
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<boolean>;
    error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            // Gọi API đăng nhập
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            // Lấy dữ liệu từ response
            const data = await response.json();
            // Kiểm tra response
            if (!response.ok) {
                setError(data.message || 'Đăng nhập thất bại');
                setIsLoading(false);
                return false;
            }else{
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                try {
                    const response = await ServiceApi.get('user/profile');
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch (error) {
                    setError('An error occurred during login');
                    return false;
                }
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
                return true;
            }
        } catch (err) {
            setError('An error occurred during login');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    // Register function
    const register = async (email: string, password: string, name: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        console.log(email, password, name);

        // try {
        //     // Simulate API call delay
        //     await new Promise(resolve => setTimeout(resolve, 800));

        //     // Check if user already exists
        //     if (MOCK_USERS.some(u => u.email === email)) {
        //         setError('User with this email already exists');
        //         return false;
        //     }

        //     // In a real app, you would make an API call to create the user
        //     // For this demo, we'll just pretend it worked and log them in
        //     const newUser: User = {
        //         id: `${MOCK_USERS.length + 1}`,
        //         email,
        //         name,
        //         role: 'user',
        //     };

        //     setUser(newUser);
        //     localStorage.setItem('user', JSON.stringify(newUser));
        //     navigate('/');
        //     return true;
        // } catch (err) {
        //     setError('An error occurred during registration');
        //     return false;
        // } finally {
        //     setIsLoading(false);
        // }
        return false;
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        error
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 