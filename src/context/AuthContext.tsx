import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email?: string;
  photoUrl?: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  registerUser: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<boolean>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  takeProfilePhoto: () => Promise<string | null>;
  pickProfilePhotoFromGallery: () => Promise<string | null>;
  removeProfilePhoto: () => Promise<void>;
  updateCurrentUserName: (name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = '@todoapp:auth';
const USERS_KEY = '@todoapp:users';

// Datos iniciales de usuarios de prueba
const initialUsers: (User & { password: string })[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Administrador',
    role: 'admin',
    email: 'admin@ejemplo.com',
    password: 'admin123'
  },
  {
    id: '2',
    username: 'usuario',
    name: 'Usuario Normal',
    role: 'user',
    email: 'usuario@ejemplo.com',
    password: 'user123'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Cargar usuarios iniciales si no existen
      const existingUsers = await AsyncStorage.getItem(USERS_KEY);
      if (!existingUsers) {
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      }

      // Verificar si hay una sesión activa
      const sessionData = await AsyncStorage.getItem(AUTH_KEY);
      if (sessionData) {
        setCurrentUser(JSON.parse(sessionData));
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      if (usersData) {
        const users = JSON.parse(usersData);
        return users.map((u: any) => ({
          id: u.id,
          username: u.username,
          name: u.name,
          role: u.role,
          email: u.email
        }));
      }
    } catch (error) {
      console.error('Error getting users:', error);
    }
    return [];
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      if (usersData) {
        const users = JSON.parse(usersData);
        const user = users.find((u: any) =>
          (u.username === username || u.email === username) && u.password === password
        );
        
        if (user) {
          const userWithoutPassword = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email
          };
          
          await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
          setCurrentUser(userWithoutPassword);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error login:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logout:', error);
    }
  };

  const registerUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      let users = usersData ? JSON.parse(usersData) : [];
      
      // Verificar que el usuario no exista
      if (users.some((u: any) => u.username === userData.username)) {
        return false;
      }

      const newUser = {
        ...userData,
        id: Date.now().toString()
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      if (usersData) {
        let users = JSON.parse(usersData);
        users = users.filter((u: any) => u.id !== userId);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      if (usersData) {
        let users = JSON.parse(usersData);
        users = users.map((u: any) => u.id === userId ? { ...u, role } : u);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  };

  const updateCurrentUserInStorage = async (updates: Partial<User>) => {
    if (!currentUser) return false;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));

    const usersData = await AsyncStorage.getItem(USERS_KEY);
    if (usersData) {
      const users = JSON.parse(usersData);
      const idx = users.findIndex((u: any) => u.id === currentUser.id);
      if (idx !== -1) {
        const storedPass = users[idx].password;
        users[idx] = { ...users[idx], ...updates };
        if (storedPass) users[idx].password = storedPass;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }
    return true;
  };

  const takeProfilePhoto = async (): Promise<string | null> => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara.');
          return null;
        }
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await updateCurrentUserInStorage({ photoUrl: uri });
        return uri;
      }
      return null;
    } catch (e) {
      console.error('Error taking profile photo:', e);
      return null;
    }
  };

  const pickProfilePhotoFromGallery = async (): Promise<string | null> => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería.');
          return null;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await updateCurrentUserInStorage({ photoUrl: uri });
        return uri;
      }
      return null;
    } catch (e) {
      console.error('Error picking profile photo:', e);
      return null;
    }
  };

  const removeProfilePhoto = async (): Promise<void> => {
    await updateCurrentUserInStorage({ photoUrl: null });
  };

  const updateCurrentUserName = async (name: string): Promise<boolean> => {
    return updateCurrentUserInStorage({ name });
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isLoading, 
      login, 
      logout, 
      registerUser, 
      getAllUsers, 
      deleteUser, 
      updateUserRole,
      takeProfilePhoto,
      pickProfilePhotoFromGallery,
      removeProfilePhoto,
      updateCurrentUserName,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
