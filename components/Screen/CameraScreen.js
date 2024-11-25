import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';

const AI_API_URL = "https://enhanced-snake-externally.ngrok-free.app/predict";

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState('back'); // 'back' or 'front'
  const [flash, setFlash] = useState('off'); // 'on' or 'off'
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);

  // Reference for CameraView
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionMessage}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const takeAndSendPicture = async () => {
    if (cameraRef.current) {
      setProcessing(true);

      try {
        // Chụp ảnh và lưu Base64
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.8,
        });

        console.log("Photo taken:", photo.uri);

        // Gửi ảnh đến server
        const formData = new FormData();
        formData.append("file", {
          uri: photo.uri,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        const response = await fetch(AI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} - ${response.statusText}`
          );
        }

        // Lấy kết quả từ server
        const result = await response.json();
        const { processed_image, predictions } = result;

        console.log("Predictions received:", predictions);

        // Điều hướng đến Detection screen với ảnh và kết quả
        navigation.navigate("Detection", {
          image: processed_image, // Truyền ảnh Base64 đã xử lý từ server
          predictions, // Truyền kết quả từ server
        });
      } catch (error) {
        console.error("Error sending photo to server:", error);
        alert("An error occurred while connecting to the server.");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Buttons */}
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../assets/images/back_icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
          <Image
            source={
              flash === 'off'
                ? require('../../assets/images/flashoff.png')
                : require('../../assets/images/flashon.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing}>
          <Image
            source={require('../../assets/images/flip.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        {/* Processing Overlay */}
        {processing && (
          <View style={styles.processingOverlay}>
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </CameraView>

      {/* Capture Button */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takeAndSendPicture}
          disabled={processing}
        >
          <Image
            source={require('../../assets/images/cam.png')}
            style={styles.captureIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E90FF', // Blue background
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 10,
  },
  topButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
  },
  camera: {
    flex: 1,
    aspectRatio: 3 / 4,
    width: '100%',
    height: '100%',
  },
  bottomButtonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E90FF', // Màu xanh dương đồng nhất
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Đảm bảo overlay hiển thị trên cùng
  },
  processingText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Căn giữa ngang
    justifyContent:'center',
    alignItems: 'center',
  },
  permissionMessage: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
