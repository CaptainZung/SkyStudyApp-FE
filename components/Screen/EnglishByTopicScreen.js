import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from './BottomNav';
import { NGROK_API_URL } from '../../scripts/apiConfig';

export default function EnglishByTopicScreen() {
  const navigation = useNavigation();

  const navigateToVocabulary = async (topic) => {
    try {
      const response = await fetch(`${NGROK_API_URL}Topic/?topic=${topic}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch vocabulary: ${response.status}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        Alert.alert('No Vocabulary', `No vocabulary found for topic: ${topic}`);
        return;
      }

      // Điều hướng đến VocabularyScreen với dữ liệu
      navigation.navigate('VocabularyScreen', { topic, words: data });
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      Alert.alert('Error', 'Failed to load vocabulary. Please try again later.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>English by topic</Text>
      </View>

      {/* Topics Section */}
      <View style={styles.topicContainer}>
        <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Animals')}>
          <Image
            source={require('../../assets/images/whale.png')}
            style={styles.topicImage}
          />
          <Text style={styles.topicText}>Animals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Weathers')}>
          <Image
            source={require('../../assets/images/weather.png')}
            style={styles.topicImage}
          />
          <Text style={styles.topicText}>Weathers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Foods')}>
          <Image
            source={require('../../assets/images/food.png')}
            style={styles.topicImage}
          />
          <Text style={styles.topicText}>Foods</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <BottomNav />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginRight: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  topicContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  topicButton: {
    width: '40%',
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  topicImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  topicText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
