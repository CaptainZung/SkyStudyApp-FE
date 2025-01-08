import React, { useContext, useState } from 'react';
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
import LottieView from 'lottie-react-native';
import Heading from '../RootLayout/Heading';
import BottomNav from '../Root/BottomNav';
import { API_URL } from '../../scripts/apiConfig';
import { useUserContext } from '../Screen/UserContext';

export default function PronunciationCheckScreen({ route, navigation }) {
  const { word } = route.params;
  const { user } = useUserContext();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [resultText, setResultText] = useState('');
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState(null);
  const [isSaveVisible, setIsSaveVisible] = useState(false);

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
        setAnimation(null);
        setIsSaveVisible(false);
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
        setResultText('Gke zị tròi! Phát âm rất chuẩn');
        setAnimation(require('../../assets/animations/dung.json'));
        setIsSaveVisible(true);
      } else {
        setResultText('Sai mất rùi 😭 Try again 😘');
        setAnimation(require('../../assets/animations/sai.json'));
        setIsSaveVisible(false);
      }
    } catch (error) {
      console.error('Error while processing pronunciation:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const translateWord = async (text) => {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=YOUR_GOOGLE_TRANSLATE_API_KEY`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: 'vi',
            format: 'text',
          }),
        }
      );

      const result = await response.json();
      if (result.data && result.data.translations.length > 0) {
        return result.data.translations[0].translatedText;
      } else {
        return 'Không tìm thấy nghĩa';
      }
    } catch (error) {
      console.error('Translation Error:', error);
      return 'Không tìm thấy nghĩa';
    }
  };

  const handleSaveWord = async () => {
    setLoading(true);
  
    try {
      const vietnameseTranslation = await translateWord(word);
  
      const payload = {
        user: user.user,
        word,
        vietnamese: vietnameseTranslation,
      };
  
      console.log('Payload:', payload);
  
      const response = await fetch(`${API_URL}AddYourWord/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert('Thành công', `Từ "${word}" đã được lưu với nghĩa "${vietnameseTranslation}".`);
      } else if (result.error === 'Word already exists in YourDictionary') {
        Alert.alert('Thông báo', `Từ "${word}" đã tồn tại trong từ điển của bạn.`);
      } else {
        Alert.alert('Lỗi', `Không thể lưu từ vào từ điển: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving word:', error);
      Alert.alert('Error', 'Không thể kết nối với máy chủ.');
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
              loop
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

        {/* Save Button */}
        {isSaveVisible && (
          <View style={styles.saveContainer}>
            <Text style={styles.saveText}>Bạn có muốn lưu vào Từ điển của bạn không?</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveWord}>
              <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        )}

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
  saveContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  saveText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
