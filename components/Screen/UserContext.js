import React, { createContext, useContext, useState } from 'react';

// Tạo context
const UserContext = createContext();

// Tạo provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: null,
        loggedIn: false,
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useUserContext = () => useContext(UserContext);