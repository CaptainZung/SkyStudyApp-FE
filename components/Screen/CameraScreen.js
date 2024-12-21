import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  SafeAreaView,
  Animated,
  ActivityIndicator,
} from 'react-native';

const AI_API_URL = "https://enhanced-snake-externally.ngrok-free.app/predict";

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState('back'); // 'back' or 'front'
  const [flash, setFlash] = useState('off'); // 'on' or 'off'
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);

  const cameraRef = useRef(null);
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>
          We need your permission to access the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
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

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const takeAndSendPicture = async () => {
    if (cameraRef.current) {
      startAnimation();
      setProcessing(true);

      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.8,
        });

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

        const result = await response.json();
        const { processed_image, predictions } = result;

        navigation.navigate("Detection", {
          image: processed_image,
          predictions,
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
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../assets/images/back_icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.roundButton} onPress={toggleFlash}>
          <Image
            source={
              flash === 'off'
                ? require('../../assets/images/flashoff.png')
                : require('../../assets/images/flashon.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.roundButton} onPress={toggleCameraFacing}>
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
        {processing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </CameraView>

      {/* Capture Button */}
      <View style={styles.bottomButtonsContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
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
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E90FF',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  roundButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
  },
  camera: {
    flex: 1,
    width: '100%',
    marginVertical: 20,
    borderWidth: 4,
    borderColor: '#FFA500',
    borderRadius: 12,
  },
  bottomButtonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1E90FF',
  },
  captureIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF', // Nền xanh để đồng bộ với giao diện
  },
  permissionMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 5,
  },
  permissionButtonText: {
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
