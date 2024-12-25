import React, { createContext, useState, useContext } from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatarSource, setAvatarSource] = useState(null);

  return (
    <AvatarContext.Provider value={{ avatarSource, setAvatarSource }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
