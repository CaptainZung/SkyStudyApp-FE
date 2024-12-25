import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native'; // Import Lottie
import Heading from '../RootLayout/Heading';
import BottomNav from '../Root/BottomNav';

export default function PronunciationCheckScreen({ route, navigation }) {
  const { word } = route.params;
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [resultText, setResultText] = useState('');
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState(null); // Trạng thái animation

  const handleMicrophonePress = async () => {
    if (isRecording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        handleAudioAnalysis(uri);
      } catch (error) {
        console.error('Error stopping recording:', error);
        Alert.alert('Error', 'Could not stop recording.');
      }
    } else {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          Alert.alert('Permission Denied', 'Recording permission is required.');
          return;
        }

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await newRecording.startAsync();
        setRecording(newRecording);
        setIsRecording(true);
        setResultText('');
        setAnimation(null); // Xóa animation khi bắt đầu ghi âm mới
      } catch (error) {
        console.error('Error starting recording:', error);
        Alert.alert('Error', 'Could not start recording.');
      }
    }
  };

  const handleAudioAnalysis = async (uri) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('audio', {
      uri,
      type: 'audio/wav',
      name: 'recorded_audio.wav',
    });
    formData.append('reference_text', word);

    try {
      const response = await fetch('https://active-firm-cougar.ngrok-free.app/process_video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { differences } = data;

      if (differences.length === 0) {
        setResultText('Tốt lắm! Phát âm rất chuẩn');
        setAnimation(require('../../assets/animations/dung.json')); // Animation đúng
      } else {
        setResultText('Sai mất rùi 😭 Try again 😘');
        setAnimation(require('../../assets/animations/sai.json')); // Animation sai
      }
    } catch (error) {
      console.error('Error while processing pronunciation:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Header */}
        <Heading title="Kiểm Tra Phát Âm" onBackPress={() => navigation.goBack()} />

        {/* Word */}
        <Text style={styles.wordText}>{word}</Text>

        {/* Animation */}
        <View style={styles.animationContainer}>
          {animation && (
            <LottieView
              source={animation}
              autoPlay
              loop // Chạy lặp vô hạn
              style={styles.animation}
            />
          )}
        </View>

        {/* Result */}
        <View style={styles.resultBox}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Text style={styles.resultText}>{resultText}</Text>
          )}
        </View>

        {/* Microphone Section */}
        <View style={styles.microphoneContainer}>
          <TouchableOpacity
            style={[styles.microphoneButton, isRecording && styles.recordingButton]}
            onPress={handleMicrophonePress}
          >
            <Image
              source={require('../../assets/images/Micro.png')}
              style={styles.microphoneIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <BottomNav navigation={navigation} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 40,
    marginBottom: 15,
    textAlign: 'center',
    zIndex: 2,
  },
  animationContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  animation: {
    width: 150,
    height: 150,
  },
  resultBox: {
    width: '85%',
    height: 100,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
  },
  resultText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  microphoneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  microphoneButton: {
    backgroundColor: '#FFF',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: '#FF6347',
  },
  microphoneIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
