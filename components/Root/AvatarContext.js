import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatarSource, setAvatarSource] = useState(null);

  // Load avatarSource từ AsyncStorage khi ứng dụng khởi động
  useEffect(() => {
    const loadAvatarSource = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem('avatarSource');
        if (storedAvatar) {
          setAvatarSource(JSON.parse(storedAvatar)); // Parse lại từ JSON
        }
      } catch (error) {
        console.error('Failed to load avatar from storage:', error);
      }
    };

    loadAvatarSource();
  }, []);
  
  // Lưu avatarSource vào AsyncStorage khi nó thay đổi
  useEffect(() => {
    const saveAvatarSource = async () => {
      try {
        if (avatarSource) {
          await AsyncStorage.setItem('avatarSource', JSON.stringify(avatarSource)); // Lưu dưới dạng JSON
        } else {
          await AsyncStorage.removeItem('avatarSource'); // Xóa nếu null
        }
      } catch (error) {
        console.error('Failed to save avatar to storage:', error);
      }
    };

    saveAvatarSource();
  }, [avatarSource]);

  return (
    <AvatarContext.Provider value={{ avatarSource, setAvatarSource }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
