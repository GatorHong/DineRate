// context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load both token and user data from storage on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({ ...parsedUser, token });
        }
      } catch (err) {
        console.error('Error loading auth data:', err);
        setUser(null);
      }
    };

    loadAuthData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
