import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '../../scripts/apiConfig';

export default function Definition({ route, navigation }) {
  const { topic } = route.params; // Nhận topic từ màn hình trước
  const [vocabulary, setVocabulary] = useState([]); // Dữ liệu từ API
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        console.log('Fetching from:', `${API_URL}Topic/${topic}/`);
        const response = await fetch(`${API_URL}Topic/Animals/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Data fetched:', data);
        setVocabulary(data);
      } catch (err) {
        console.error('Fetch error:', err); // Log chi tiết lỗi
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchVocabulary();
  }, [topic]);

  // Hàm render từng từ trong danh sách
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.wordContainer}
      onPress={() =>
        navigation.navigate('WordDetail', { word: item }) // Điều hướng tới màn hình chi tiết từ
      }
    >
      <Text style={styles.wordText}>{item.word}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{topic}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={vocabulary}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEFA',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  wordContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  wordText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
