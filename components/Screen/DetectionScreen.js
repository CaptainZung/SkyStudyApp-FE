import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';

export default function DetectionScreen({ route, navigation }) {
  const { image, predictions } = route.params;

  const playAudio = async (base64Audio) => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: `data:audio/mp3;base64,${base64Audio}` });
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing audio", error);
    }
  };

  const renderPrediction = ({ item }) => (
    
    <View style={styles.predictionItem}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.labelVi}>{item.label_vi}</Text>

      <TouchableOpacity
        style={styles.audioButton}
        onPress={() => playAudio(item.audio_en)}
      >
        <Text style={styles.audioButtonText}>🔊 EN</Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Hiển thị ảnh xử lý từ server */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
      </View>

      {/* Danh sách dự đoán */}
      <FlatList
        data={predictions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPrediction}
        contentContainerStyle={styles.predictionList}
      />

      {/* Nút quay lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Camera</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    margin: 10,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  predictionList: {
    flexGrow: 1,
    padding: 10,
  },
  predictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  labelVi: {
    fontSize: 16,
    color: '#007AFF',
  },
  backButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
