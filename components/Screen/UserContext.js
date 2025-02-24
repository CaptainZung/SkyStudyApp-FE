import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo context
const UserContext = createContext();

// Tạo provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: null,
    loggedIn: false,
  });

  // 🔥 Hàm tải dữ liệu user từ AsyncStorage (tối ưu để tránh tạo lại)
  const loadUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser({ username: parsedUser.username, loggedIn: true });
      }
    } catch (error) {
      console.warn('⚠️ Lỗi khi tải user từ storage:', error);
    }
  }, []);

  // 🔥 Chỉ chạy 1 lần khi app khởi động
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // 🔥 Hàm đăng nhập (tối ưu tránh tạo lại mỗi lần render)
  const loginUser = useCallback(async (username) => {
    try {
      const newUser = { username, loggedIn: true };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.warn('⚠️ Lỗi khi lưu user:', error);
    }
  }, []);

  // 🔥 Hàm đăng xuất
  const logoutUser = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser({ username: null, loggedIn: false });
    } catch (error) {
      console.warn('⚠️ Lỗi khi đăng xuất:', error);
    }
  }, []);

  // 🔥 Dùng useMemo() để tránh re-render không cần thiết khi truyền `context value`
  const contextValue = useMemo(() => ({ user, setUser, loginUser, logoutUser }), [user, loginUser, logoutUser]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Custom hook để sử dụng context
export const useUserContext = () => useContext(UserContext);
