import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function LevelScreen({ route, navigation }) {
  const { gameId } = route.params; // Nhận gameId từ navigation

  // Danh sách các màn chơi
  const levels = [
    { id: '1', name: 'Màn 1' },
    { id: '2', name: 'Màn 2' },
    { id: '3', name: 'Màn 3' },
    { id: '4', name: 'Màn 4' },
    { id: '5', name: 'Màn 5' },
  ];

  const renderLevelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.levelBox}
      onPress={() => navigation.navigate('GamePlay', { levelId: item.id })}
    >
      <Text style={styles.levelText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Quay về màn hình trước
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chọn Màn Chơi</Text>
      </View>

      {/* Danh sách các màn chơi */}
      <FlatList
        data={levels}
        renderItem={renderLevelItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.levelList}
      />
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
  levelList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  levelBox: {
    width: screenWidth / 2.5,
    height: screenWidth / 4,
    backgroundColor: '#4FAAF5',
    borderRadius: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
