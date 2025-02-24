import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatarSource, setAvatarSource] = useState(null);

  useEffect(() => {
    const loadAndWatchAvatar = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem('avatarSource');
        if (storedAvatar) {
          setAvatarSource(JSON.parse(storedAvatar));
        }
      } catch (error) {
        console.warn('⚠️ Lỗi khi tải avatar:', error);
      }
    };

    loadAndWatchAvatar();
  }, []);

  const updateAvatarSource = useCallback(async (newSource) => {
    setAvatarSource(newSource);
    try {
      if (newSource) {
        await AsyncStorage.setItem('avatarSource', JSON.stringify(newSource));
      } else {
        await AsyncStorage.removeItem('avatarSource');
      }
    } catch (error) {
      console.warn('⚠️ Lỗi khi lưu avatar:', error);
    }
  }, []);

  return (
    <AvatarContext.Provider value={{ avatarSource, setAvatarSource: updateAvatarSource }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
