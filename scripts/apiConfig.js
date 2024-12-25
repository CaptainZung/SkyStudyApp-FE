import { Platform } from 'react-native';
const NGROK_API_URL = 'https://0bdd-2402-800-629c-2ed0-1193-9f4f-50bd-c7e9.ngrok-free.app/app/';
const LOCAL_API_URL = 'http://172.0.0.1:8000/app/Login'; // Default for local environment
const SERVER_API_URL = 'https://enhanced-snake-externally.ngrok-free.app/predict';

// export const API_URL =
//   Platform.OS === 'ios' || Platform.OS === 'android'
//     ? NGROK_API_URL // Sử dụng URL từ ngrok cho thiết bị thật
//     : LOCAL_API_URL; // Sử dụng localhost cho môi trường web hoặc giả lập
export const AI_API_URL = SERVER_API_URL;
export const API_URL = NGROK_API_URL