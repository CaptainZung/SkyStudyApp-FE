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
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios'; // Sử dụng axios để gọi API
import BottomNav from '../Root/BottomNav';

export default function YourDictionary() {
  const navigation = useNavigation();
  const [dictionary, setDictionary] = useState([]); // State để lưu từ điển
  const [isFlipped, setIsFlipped] = useState({}); // Theo dõi trạng thái lật thẻ
  const [loading, setLoading] = useState({}); // Theo dõi trạng thái loading của mỗi từ

  // Hàm tải dữ liệu từ điển từ AsyncStorage
  const loadDictionary = async () => {
    try {
      const storedWords = await AsyncStorage.getItem('dictionary');
      const words = storedWords ? JSON.parse(storedWords) : [];
      setDictionary(words);
    } catch (error) {
      console.error('Lỗi khi tải từ điển:', error);
    }
  };

  // Tải lại từ điển khi màn hình được focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadDictionary);
    return unsubscribe;
  }, [navigation]);

  // Hàm dịch từ
  const translateWord = async (word, index) => {
    setLoading((prev) => ({ ...prev, [index]: true })); // Hiển thị loading
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        {
          q: word,
          source: 'en',
          target: 'vi',
          key: 'YOUR_GOOGLE_TRANSLATE_API_KEY',
        }
      );
      const translatedText = response.data.data.translations[0].translatedText;

      // Lật thẻ và cập nhật từ dịch
      setIsFlipped((prev) => ({ ...prev, [index]: translatedText }));
    } catch (error) {
      console.error('Lỗi khi dịch từ:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false })); // Ẩn loading
    }
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Từ điển của bạn</Text>
      </View>

      {/* Phần tìm kiếm */}
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

      {/* Danh sách từ */}
      <ScrollView contentContainerStyle={styles.wordList}>
        {dictionary.map((word, index) => (
          <TouchableOpacity
            key={index}
            style={styles.flashcard}
            onPress={() =>
              isFlipped[index]
                ? setIsFlipped((prev) => ({ ...prev, [index]: false }))
                : translateWord(word.english, index)
            }
          >
            {loading[index] ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.flashcardText}>
                {isFlipped[index] ? isFlipped[index] : word.english}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Thanh điều hướng dưới */}
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
    backgroundColor: '#00BCD4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    width: '100%',
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
