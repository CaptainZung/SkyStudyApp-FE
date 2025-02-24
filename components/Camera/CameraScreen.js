import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import LoadingPopup from "../Root/LoadingPopup";
import { AI_API_URL } from "../../scripts/apiConfig";

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const cameraRef = useRef(null);
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (permission && !permission.granted) {
      setShowPermissionModal(true);
    }
  }, [permission]);

  const requestCameraPermission = async () => {
    const { granted } = await requestPermission();
    setShowPermissionModal(!granted);
  };

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  const startAnimation = useCallback(() => {
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
  }, [scaleAnimation]);

  const takeAndSendPicture = async () => {
    if (!cameraRef.current) return;

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

      const response = await axios.post(`${AI_API_URL}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigation.navigate("Detection", {
        image: response.data.processed_image,
        predictions: response.data.predictions,
      });
    } catch (error) {
      console.error("Error sending photo to server:", error);
      alert("An error occurred while connecting to the server.");
    } finally {
      setProcessing(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <LoadingPopup visible={processing} />

      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/images/back_icon.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundButton}
          onPress={toggleCameraFacing}
        >
          <Image
            source={require("../../assets/images/flip.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flashMode={flash}
      >
        {processing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </CameraView>

      <View style={styles.bottomButtonsContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takeAndSendPicture}
            disabled={processing}
          >
            <Image
              source={require("../../assets/images/cam.png")}
              style={styles.captureIcon}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Permission Request Modal */}
      <Modal visible={showPermissionModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Camera Permission Needed</Text>
            <Text style={styles.modalText}>
              Please grant camera access to use this feature.
            </Text>
            <Pressable
              style={styles.permissionButton}
              onPress={requestCameraPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E90FF" },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  roundButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 30,
  },
  camera: {
    flex: 1,
    width: "100%",
    marginVertical: 20,
    borderWidth: 4,
    borderColor: "#FFA500",
    borderRadius: 12,
  },
  bottomButtonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1E90FF",
  },
  captureIcon: { width: 60, height: 60, resizeMode: "contain" },
  icon: { width: 45, height: 45, resizeMode: "contain" },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  permissionButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
