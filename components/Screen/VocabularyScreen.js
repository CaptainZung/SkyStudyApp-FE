import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
  Alert,
} from 'react-native';
import BottomNav from './BottomNav';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../scripts/apiConfig';

export default function VocabularyScreen({ route }) {
  const { topic, words } = route.params;
  const [searchText, setSearchText] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize and sort the word list alphabetically
    const sortedWords = [...words].sort((a, b) => a.word.localeCompare(b.word));
    setFilteredWords(sortedWords);
  }, [words]);

  const handleSearch = (text) => {
    setSearchText(text);
    // Filter the word list based on search text
    const filtered = words.filter((item) =>
      item.word.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredWords(filtered);
  };

  const navigateToExample = async (word) => {
    try {
      const response = await fetch(`${API_URL}Topic/${topic}/${word}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch details for word: ${response.status}`);
      }
      const data = await response.json();

      if (data.error) {
        Alert.alert('Error', data.error);
        return;
      }

      // Navigate to ExampleForVocabScreen with word details
      navigation.navigate('ExampleForVocab', { wordData: data });
    } catch (error) {
      console.error('Error fetching word details:', error);
      Alert.alert('Error', 'Failed to load word details. Please try again later.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{topic}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch} // Trigger search on text change
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Word List */}
      <FlatList
        data={filteredWords} // Render filtered word list
        numColumns={4} // Display 4 columns
        keyExtractor={(item) => item.word}
        contentContainerStyle={styles.wordListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordButton}
            onPress={() => navigateToExample(item.word)}
          >
            <Text style={styles.wordText}>{item.word}</Text>
          </TouchableOpacity>
        )}
      />

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
    padding: 15,
    backgroundColor: '#00BCD4',
  },
  backButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 20,
    color: '#999',
  },
  wordListContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Add padding to avoid overlapping with BottomNav
  },
  wordButton: {
    flex: 1,
    margin: 5,
    height: 70,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '22%', // Ensure the button fits within 4 columns
  },
  wordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
});
