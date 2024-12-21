import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PronunciationCheckScreen({ route, navigation }) {
  const { word, translation } = route.params; // Receive both English word and its translation
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState(null);
  const [resultText, setResultText] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMicrophonePress = async () => {
    if (isRecording) {
      return;
    }

    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Denied', 'Recording permission is required.');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setIsRecording(true);

      setTimeout(async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordedUri(uri);
        setIsRecording(false);
        Alert.alert('Recording Finished', 'Recording saved successfully.');
      }, 5000); // Stop after 5 seconds
    } catch (error) {
      console.error(error);
      setIsRecording(false);
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const handleContinue = async () => {
    if (!recordedUri) {
      Alert.alert('No Recording', 'Please record your voice first.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('audio', {
      uri: recordedUri, // Path from the recording API
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

      // Determine result based on backend response
      if (differences.length === 0) {
        setResultText({ text: 'Tốt lắm !', color: 'green' });
      } else {
        setResultText({ text: 'Gần đúng rồi !', color: 'orange' });
      }
    } catch (error) {
      console.error('Error while processing pronunciation:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const newWord = { english: word, vietnamese: translation };
      const storedWords = await AsyncStorage.getItem('dictionary');
      const dictionary = storedWords ? JSON.parse(storedWords) : [];
      const updatedDictionary = [...dictionary, newWord];

      await AsyncStorage.setItem('dictionary', JSON.stringify(updatedDictionary));
      Alert.alert('Success', 'Word saved to your dictionary!');

      // Navigate to the dictionary screen
      navigation.navigate('Dictionary');
    } catch (error) {
      console.error('Error saving word:', error);
      Alert.alert('Error', 'Could not save the word.');
    }
  };

  const handleRetry = () => {
    setRecordedUri(null);
    setResultText(null);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Kiểm Tra Phát Âm</Text>
        </View>

        {/* Word Display */}
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{word}</Text>
        </View>

        {/* Microphone Section */}
        {!resultText ? (
          <View style={styles.microphoneContainer}>
            <TouchableOpacity
              onPress={handleMicrophonePress}
              style={[styles.microphoneButton, isRecording && styles.recordingButton]}
            >
              <Image
                source={require('../../assets/images/Micro.png')}
                style={styles.microphoneIcon}
              />
            </TouchableOpacity>
            <Text style={styles.recordingText}>
              {isRecording ? 'Recording...' : 'Press to Start Recording'}
            </Text>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, { color: resultText.color }]}>
              {resultText.text}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {resultText ? (
            <>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
              >
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleSave}
              >
                <Text style={styles.continueButtonText}>Lưu</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.continueButtonText}>Tiếp Tục</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#007AFF',
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wordContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  word: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  microphoneContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  microphoneButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  microphoneIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  recordingButton: {
    backgroundColor: '#FF4500',
  },
  recordingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  resultContainer: {
    marginVertical: 40,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
