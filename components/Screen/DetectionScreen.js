import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

export default function DetectionScreen({ route, navigation }) {
  const { image, predictions } = route.params;

  // Hàm xử lý khi nhấn vào item trong danh sách
  const handlePress = (item) => {
    navigation.navigate('PronunCheck', { word: item.label });
  };

  const renderPrediction = ({ item }) => (
    <TouchableOpacity
      style={styles.predictionItem}
      onPress={() => handlePress(item)} // Bắt sự kiện nhấn
    >
      <View>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.labelVi}>{item.label_vi}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Hiển thị hình ảnh */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${image}` }}
          style={styles.image}
        />
      </View>

      {/* Danh sách dự đoán */}
      <FlatList
        data={predictions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPrediction}
        contentContainerStyle={styles.predictionList}
      />

      {/* Nút Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Camera</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    resizeMode: 'contain',
  },
  predictionList: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  predictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  labelVi: {
    fontSize: 16,
    color: '#007AFF',
  },
  backButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
