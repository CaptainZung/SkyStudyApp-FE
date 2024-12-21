import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import BottomNav from './BottomNav';

export default function YourDictionary() {
  const navigation = useNavigation();
  const [dictionary, setDictionary] = useState([]); // State to store words in dictionary
  const [isFlipped, setIsFlipped] = useState({}); // Track flip status of flashcards

  // Load saved words from AsyncStorage
  const loadDictionary = async () => {
    try {
      const storedWords = await AsyncStorage.getItem('dictionary');
      const words = storedWords ? JSON.parse(storedWords) : [];
      setDictionary(words);
    } catch (error) {
      console.error('Error loading dictionary:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadDictionary); // Reload dictionary when screen is focused
    return unsubscribe;
  }, [navigation]);

  const handleWordClick = (index) => {
    setIsFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  };

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
        {dictionary.map((word, index) => (
          <TouchableOpacity
            key={index}
            style={styles.flashcard}
            onPress={() => handleWordClick(index)}
          >
            {isFlipped[index] ? (
              <Text style={styles.flashcardText}>{word.vietnamese}</Text>
            ) : (
              <Text style={styles.flashcardText}>{word.english}</Text>
            )}
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
  flashcard: {
    backgroundColor: '#4FAAF5',
    borderRadius: 15,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  flashcardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
