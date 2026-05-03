import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@HiveFiap:user');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function login(email, password) {
    const storedData = await AsyncStorage.getItem(`@HiveFiap:account_${email}`);
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.password === password) {
        await AsyncStorage.setItem('@HiveFiap:user', JSON.stringify(userData));
        setUser(userData);
        router.replace('/(tabs)'); 
        return { success: true };
      }
    }
    return { success: false, message: 'E-mail ou senha incorretos.' };
  }

  async function logout() {
    await AsyncStorage.removeItem('@HiveFiap:user');
    setUser(null);
    router.replace('/login');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);