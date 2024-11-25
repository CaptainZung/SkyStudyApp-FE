import { Platform } from 'react-native';
const NGROK_API_URL = 'https://3040-2001-ee0-4b7a-8ae0-6d4b-be8a-389c-77df.ngrok-free.app/app/';
const LOCAL_API_URL = 'http://172.0.0.1:8000/app/Login'; // Default for local environment
const SERVER_API_URL = 'https://enhanced-snake-externally.ngrok-free.app/predict';

// export const API_URL =
//   Platform.OS === 'ios' || Platform.OS === 'android'
//     ? NGROK_API_URL // Sử dụng URL từ ngrok cho thiết bị thật
//     : LOCAL_API_URL; // Sử dụng localhost cho môi trường web hoặc giả lập

    
export const AI_API_URL = SERVER_API_URL;
export const API_URL = NGROK_API_URL
// http://127.0.0.1:8000/app/Login/