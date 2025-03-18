import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
    if (!socket) {
      console.log("Initializing socket...");
      socket = io(process.env.socket_url); 
    } else {
      console.log("Socket already initialized.");
    }
    return socket;
  };
  
export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket() first.");
  }
  return socket;
};