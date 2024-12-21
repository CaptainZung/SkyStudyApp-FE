import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from './BottomNav';
import { API_URL } from '../../scripts/apiConfig';

export default function EnglishByTopicScreen() {
  const navigation = useNavigation();

  const navigateToVocabulary = async (topic) => {
    try {
      const response = await fetch(`${API_URL}Topic/${topic}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch vocabulary: ${response.status}`);
      }
      const data = await response.json();

      if (data.error) {
        Alert.alert('Error', data.error);
        return;
      }

      navigation.navigate('Vocabulary', { topic, words: data });
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
        <Text style={styles.title}>Tiếng Anh Theo Chủ Đề</Text>
      </View>

      {/* Topics Section */}
      <View style={styles.topicContainer}>
        {/* Row 1 */}
        <View style={styles.topicRow}>
          <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Animals')}>
            <Image
              source={require('../../assets/images/whale.png')}
              style={styles.topicImage}
            />
            <Text style={styles.topicText}>Động vật</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Weather')}>
            <Image
              source={require('../../assets/images/weather.png')}
              style={styles.topicImage}
            />
            <Text style={styles.topicText}>Thời tiết</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View style={styles.topicRow}>
          <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Food')}>
            <Image
              source={require('../../assets/images/food.png')}
              style={styles.topicImage}
            />
            <Text style={styles.topicText}>Thức ăn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Family')}>
            <Image
              source={require('../../assets/images/family.png')}
              style={styles.topicImage}
            />
            <Text style={styles.topicText}>Gia đình</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3 */}
        <View style={styles.topicRow}>
          <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Flags')}>
            <Image
              source={require('../../assets/images/flag.png')}
              style={styles.topicImage}
            />
            <Text style={styles.topicText}>Quốc Tịch</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Emotions')}>
            <Image
              source={require('../../assets/images/emotion.png')}
              style={styles.topicImage}
            />
            <Text style={styles.topicText}>Cảm xúc</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4 */}
        <View style={styles.topicRow}>
          <TouchableOpacity style={styles.topicButton} onPress={() => navigateToVocabulary('Transport')}>
            <Image
              source={require('../../assets/images/transport.png')}
              style={styles.topicImage}
            />
            <Text style={styles.topicText}>Phương tiện</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#00BCD4',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
  },
  backButton: {
    marginRight: 10,
    padding: 8,
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
    paddingHorizontal: 10,
    marginTop: 20,
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  topicButton: {
    width: '48%',
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
