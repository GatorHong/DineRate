import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Optional: restore token on app start
  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // You'll typically fetch user data from backend using the token
        // For now, just store the token if you want
        setUser({ token }); // Replace with full user if needed
      }
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
