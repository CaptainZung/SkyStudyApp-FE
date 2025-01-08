import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useUserContext } from '../Screen/UserContext'; // Import UserContext
import { API_URL } from '../../scripts/apiConfig';
import Heading from '../RootLayout/Heading'; // Import Heading

export default function YourDictionary({ navigation }) {
  const { user } = useUserContext(); // Lấy user từ Context
  const [dictionary, setDictionary] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredDictionary, setFilteredDictionary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm tải từ điển
  const fetchDictionary = async () => {
    try {
      setLoading(true);
  
      // Gửi request với POST method và body chứa user
      const response = await fetch(`${API_URL}YourDictionary/`, {
        method: 'POST', // Sử dụng POST thay vì GET
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user.user }), // Truyền dữ liệu trong body
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Dictionary data fetched:', data);
  
        // Lưu dữ liệu từ API vào state
        setDictionary(data.learned_words);
        setFilteredDictionary(data.learned_words);
      } else {
        console.error('Error fetching dictionary:', response.status);
      }
    } catch (error) {
      console.error('Error in fetchDictionary:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được render
  useEffect(() => {
    fetchDictionary();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = dictionary.filter((word) =>
      word.word.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDictionary(filtered);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Heading Section */}
      <Heading title="Từ điển của bạn" onBackPress={() => navigation.goBack()} />

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm từ vựng"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView contentContainerStyle={styles.wordList}>
        {filteredDictionary.map((word, index) => (
          <View key={index} style={styles.wordItem}>
            <Text style={styles.wordText}>
              {word.word} - {word.vietnamese}
            </Text>
            <Text style={styles.learnedDate}>
              Ngày học: {word.learned_date}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  searchSection: {
    flexDirection: 'row',
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
  wordList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  wordItem: {
    backgroundColor: '#4FAAF5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  learnedDate: {
    fontSize: 14,
    color: '#EEE',
  },
});
