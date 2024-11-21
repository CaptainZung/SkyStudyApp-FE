import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userName, setUserName] = useState('Guest');
  const [avatarSource, setAvatarSource] = useState(null);

  return (
    <UserContext.Provider value={{ userName, setUserName, avatarSource, setAvatarSource }}>
      {children}
    </UserContext.Provider>
  );
}
