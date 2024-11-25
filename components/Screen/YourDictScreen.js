import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from './BottomNav';

export default function YourDictionary() {
  const navigation = useNavigation(); // Use the `useNavigation` hook to access navigation object

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Go back to the previous screen
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Từ điển của bạn</Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image
            source={require('../../assets/images/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Word List */}
      <ScrollView contentContainerStyle={styles.wordList}>
        {['Employee', 'Exhibition', 'Furniture', 'Wash'].map((word, index) => (
          <TouchableOpacity key={index} style={styles.wordButton}>
            <Text style={styles.wordButtonText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
    marginTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    padding: 5,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  wordList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  wordButton: {
    backgroundColor: '#4FAAF5',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  wordButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
