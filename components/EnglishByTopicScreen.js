import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from './BottomNav';

export default function EnglishByTopicScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/images/anhnenchinh.png')}
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
        <TouchableOpacity style={styles.topicButton}>
          <Image
            source={require('../assets/images/whale.png')}
            style={styles.topicImage}
          />
          <Text style={styles.topicText}>Animals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topicButton}>
          <Image
            source={require('../assets/images/weather.png')}
            style={styles.topicImage}
          />
          <Text style={styles.topicText}>Weathers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topicButton}>
          <Image
            source={require('../assets/images/food.png')}
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
    padding: 10, // Tăng không gian bên trong nút
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Thêm nền để nổi bật hơn
    borderRadius: 10, // Bo góc
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  title: {
    fontSize: 20,
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
