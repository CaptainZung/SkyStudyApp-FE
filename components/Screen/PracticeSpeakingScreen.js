import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';

export default function PracticeSpeakingScreen({ route, navigation }) {
  const { referenceText } = route.params; // Get the reference text from navigation params
  const [recordedUri, setRecordedUri] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = async () => {
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

  const handleSubmitRecording = async () => {
    if (!recordedUri) {
      Alert.alert('No Recording', 'Please record your voice first.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', {
      uri: recordedUri,
      name: 'recorded_audio.wav',
      type: 'audio/wav',
    });
    formData.append('reference_text', referenceText);

    try {
      const response = await fetch("https://active-firm-cougar.ngrok-free.app/process_video", {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();

      if (response.ok) {
        setAnalysisResult(result);
      } else {
        Alert.alert('Error', result.error || 'Could not process the recording.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  const handleRetry = () => {
    setRecordedUri(null);
    setAnalysisResult(null);
  };

  const renderColoredText = (coloredText) => {
    return (
      <View style={styles.textRow}>
        {coloredText.map((item, index) => (
          <Text
            key={index}
            style={{
              color: item.color === 'green' ? 'green' : 'red',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            {item.word}{' '}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.referenceText}>{referenceText}</Text>

        {analysisResult ? (
          <View style={styles.resultContainer}>
            {renderColoredText(analysisResult.colored_text)}
          </View>
        ) : (
          <View style={styles.microphoneContainer}>
            <TouchableOpacity
              style={[styles.microphoneButton, isRecording && styles.recordingButton]}
              onPress={handleRecord}
              disabled={isRecording}
            >
              <Text style={styles.microphoneIcon}>🎤</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleRetry}>
            <Text style={styles.actionText}>Thử lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSubmitRecording}>
            <Text style={styles.actionText}>Gửi</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  referenceText: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 20,
  },
  microphoneContainer: {
    marginBottom: 30,
  },
  microphoneButton: {
    backgroundColor: '#1E90FF',
    padding: 20,
    borderRadius: 50,
  },
  microphoneIcon: {
    fontSize: 40,
    color: '#FFF',
  },
  recordingButton: {
    backgroundColor: '#FF4500',
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  actionButton: {
    backgroundColor: '#0080FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
  },
});
