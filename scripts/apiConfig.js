// import { Platform } from 'react-native';
// const NGROK_API_URL = 'http://172.26.248.176:8000/app/';
// const LOCAL_API_URL = 'http://172.0.0.1:8000/app/'; // Default for local environment
// const SERVER_API_URL = 'http://172.26.248.176:5000/predict';

// // export const API_URL =
// //   Platform.OS === 'ios' || Platform.OS === 'android'
// //     ? NGROK_API_URL // Sử dụng URL từ ngrok cho thiết bị thật
// //     : LOCAL_API_URL; // Sử dụng localhost cho môi trường web hoặc giả lập
// export const AI_API_URL = SERVER_API_URL;
// export const API_URL = NGROK_API_URL;

import { Platform } from 'react-native';

const API = 'http://192.168.1.15'; //chỉnh sửa IP của máy ở đây

const SERVER_API_URL = `${API}:7000/app/`; //chỉnh sửa API server ở đây dùng 7000
const LOCAL_API_URL = `${API}:8000`;//chỉnh sửa API YOLO ở đây dùng 8000
const AUDIO_API_URL = `${API}:6000`;//chỉnh sửa API phát âm dùng 600

export const AI_API_URL = LOCAL_API_URL;
export const API_URL = SERVER_API_URL;
export const AUDIO_URL = AUDIO_API_URL;