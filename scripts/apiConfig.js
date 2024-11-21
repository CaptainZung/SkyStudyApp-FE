import { Platform } from 'react-native';
const NGROK_API_URL = 'https://33ce-2001-ee0-7b22-2400-31d9-4d1d-b2c9-7ded.ngrok-free.app/app';
const LOCAL_API_URL = 'http://172.0.0.1:8000/app/Login'; // Default for local environment
const SERVER_API_URL = 'https://enhanced-snake-externally.ngrok-free.app/predict';

// export const API_URL =
//   Platform.OS === 'ios' || Platform.OS === 'android'
//     ? NGROK_API_URL // Sử dụng URL từ ngrok cho thiết bị thật
//     : LOCAL_API_URL; // Sử dụng localhost cho môi trường web hoặc giả lập

    
export const AI_API_URL = SERVER_API_URL;
export const API_URL = NGROK_API_URL
// http://127.0.0.1:8000/app/Login/