import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import Heading from '../RootLayout/Heading';
import BottomNav from '../Root/BottomNav';

export default function PracticeSpeakingScreen({ route, navigation }) {
  const { referenceText } = route.params; // Get the reference text from navigation params
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState(null);
  const [resultText, setResultText] = useState('');

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
    formData.append('reference_text', referenceText);

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
        setResultText('Excellent! Your pronunciation is perfect.');
        setAnimation(require('../../assets/animations/dung.json'));
      } else {
        setResultText('Some mistakes were found. Try again!');
        setAnimation(require('../../assets/animations/sai.json'));
      }

      setAnalysisResult(data);
    } catch (error) {
      console.error('Error while processing pronunciation:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
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
        <Heading title="Practice Speaking" onBackPress={() => navigation.goBack()} />

        <Text style={styles.referenceText}>{referenceText}</Text>

        {animation && (
          <View style={styles.animationContainer}>
            <LottieView source={animation} autoPlay loop style={styles.animation} />
          </View>
        )}

        <View style={styles.resultBox}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : analysisResult ? (
            renderColoredText(analysisResult.colored_text)
          ) : (
            <Text style={styles.resultText}>Press the microphone to start.</Text>
          )}
        </View>

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
  referenceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
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
    minHeight: 50,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  microphoneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 180,
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
