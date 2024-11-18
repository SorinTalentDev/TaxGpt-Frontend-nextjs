"use client"
import React, { createContext, useState, useEffect } from 'react';

// Create the session context
const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  // State to track login status and session timeout
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionTimeout] = useState(30 * 60 * 1000); // 5 minutes
  const [lastActivity, setLastActivity] = useState(Date.now()); // Track the last activity time

  // Update last activity when user interacts
  const resetSessionTimeout = () => setLastActivity(Date.now());

  useEffect(() => {
    const checkSession = () => {
      if (Date.now() - lastActivity > sessionTimeout) {
        // setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('userId', '');
      }
    };

    const interval = setInterval(checkSession, 1000); // Check every second
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [lastActivity, sessionTimeout]); // Dependency array to trigger on session timeout change

  return (
    <SessionContext.Provider value={{resetSessionTimeout,setLastActivity }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to access session context
export const useSession = () => React.useContext(SessionContext);
