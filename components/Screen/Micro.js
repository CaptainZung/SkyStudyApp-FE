import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const AudioRecorder = () => {
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        const recordingObject = new Audio.Recording();
        await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recordingObject.startAsync();
        setRecording(recordingObject);
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Lỗi khi bắt đầu thu âm:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setIsRecording(false);
      console.log('File âm thanh lưu tại:', uri);
    } catch (error) {
      console.error('Lỗi khi dừng thu âm:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isRecording ? 'red' : 'green' }]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Dừng thu âm' : 'Bắt đầu thu âm'}</Text>
      </TouchableOpacity>

      {audioUri && (
        <View style={styles.audioContainer}>
          <Text style={styles.audioText}>File âm thanh: {audioUri}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  audioContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  audioText: {
    fontSize: 14,
    color: 'black',
  },
});

export default AudioRecorder;
