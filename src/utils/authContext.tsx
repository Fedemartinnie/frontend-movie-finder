import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
        setIsLoggedIn(true);
      }
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem('authToken', token);    
    console.log(AsyncStorage.getItem('authToken'));
    setAuthToken(token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setAuthToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};