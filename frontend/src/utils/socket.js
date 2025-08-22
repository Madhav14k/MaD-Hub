import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
export const socket = io(URL, { autoConnect: false });
