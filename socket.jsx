import { createContext, useMemo, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server } from './src/constants/config'; // Replace with your server URL

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null); // State to hold the token

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setAuthToken(token); // Set token in state
        console.log("Retrieved authToken from socket:", token);
      } catch (error) {
        console.error('Error fetching authToken from AsyncStorage:', error);
      }
    };

    fetchToken();
  }, []); // Fetch token on mount

  const socket = useMemo(() => {
    if (!authToken) return null; // Prevent connection if no token is available

    return io(server, {
      withCredentials: true,
      auth: {
        token: authToken,
      },
    });
  }, [authToken]);

  useEffect(() => {
    if (!socket) return;

    // Event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
