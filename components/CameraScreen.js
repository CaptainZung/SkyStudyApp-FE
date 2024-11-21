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
import { AI_API_URL } from '../scripts/apiConfig';

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState('back'); // 'back' or 'front'
  const [flash, setFlash] = useState('off'); // 'on' or 'off'
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);

  // Reference for CameraView
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
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
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.8, // Adjust the quality (0-1) as needed
        });
        console.log('Photo taken:', photo.uri);

        const formData = new FormData();
        formData.append('file', {
          uri: photo.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });

        const response = await fetch(AI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} - ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log('Predictions received:', result);

        navigation.navigate('Detection', { predictions: result.results });
      } catch (error) {
        console.error('Error sending photo to server:', error);
        alert('An error occurred while connecting to the server.');
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
            source={require('../assets/images/back_icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
          <Image
            source={
              flash === 'off'
                ? require('../assets/images/flashoff.png')
                : require('../assets/images/flashon.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing}>
          <Image
            source={require('../assets/images/flip.png')}
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
            source={require('../assets/images/cam.png')}
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
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 18,
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
