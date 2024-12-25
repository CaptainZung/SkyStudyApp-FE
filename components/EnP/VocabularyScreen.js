import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
  Alert,
  Text,
} from 'react-native';
import BottomNav from '../Root/BottomNav';
import Heading from '../RootLayout/Heading'; // Import Heading
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../scripts/apiConfig';

export default function VocabularyScreen({ route }) {
  const { topic, words } = route.params;
  const [searchText, setSearchText] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Sắp xếp danh sách từ theo thứ tự bảng chữ cái khi khởi tạo
    const sortedWords = [...words].sort((a, b) => a.word.localeCompare(b.word));
    setFilteredWords(sortedWords);
  }, [words]);

  const handleSearch = (text) => {
    setSearchText(text);
    // Lọc danh sách từ theo nội dung tìm kiếm
    const filtered = words.filter((item) =>
      item.word.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredWords(filtered);
  };

  const navigateToExample = async (word) => {
    try {
      const response = await fetch(`${API_URL}Topic/${topic}/${word}/`);
      if (!response.ok) {
        throw new Error(`Không thể lấy chi tiết cho từ: ${response.status}`);
      }
      const data = await response.json();

      if (data.error) {
        Alert.alert('Lỗi', data.error);
        return;
      }

      // Điều hướng đến màn hình ExampleForVocabScreen với thông tin từ vựng
      navigation.navigate('ExampleForVocab', { wordData: data });
    } catch (error) {
      console.error('Lỗi khi tải chi tiết từ vựng:', error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết từ. Vui lòng thử lại sau.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Sử dụng Heading thay vì header cũ */}
      <Heading title={topic} onBackPress={() => navigation.goBack()} />

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch} // Gọi hàm tìm kiếm khi thay đổi nội dung
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Danh sách từ vựng */}
      <FlatList
        data={filteredWords} // Hiển thị danh sách từ đã lọc
        numColumns={4} // Hiển thị 4 cột
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

      {/* Thanh điều hướng dưới cùng */}
      <BottomNav />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
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
    paddingBottom: 80, // Thêm khoảng cách tránh trùng với BottomNav
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
    maxWidth: '22%', // Đảm bảo nút vừa trong 4 cột
  },
  wordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
});
