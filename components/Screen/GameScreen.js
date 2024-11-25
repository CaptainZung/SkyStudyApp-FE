import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from './BottomNav'; // Import BottomNav component

const screenWidth = Dimensions.get('window').width;

export default function GameScreen() {
  const navigation = useNavigation();

  // Danh sách các trò chơi
  const games = [
    { id: '1', name: 'Game 1' },
    { id: '2', name: 'Game 2' },
    { id: '3', name: 'Game 3' },
    { id: '4', name: 'Game 4' },
    { id: '5', name: 'Game 5' },
    { id: '6', name: 'Game 6' },
  ];

  const renderGameItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameBox}
      onPress={() => {
        if (item.id === '1') {
          navigation.navigate('Level', { gameId: item.id });
        } else {
          alert('Chức năng này chưa được triển khai!');
        }
      }}
    >
      <Text style={styles.gameText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')} // Nền hình ảnh
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Nút quay lại
        >
          <Image source={require('../../assets/images/back_icon.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Playing Game</Text>
      </View>

      {/* Danh sách các trò chơi */}
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gameList}
      />

      {/* Điều hướng dưới cùng */}
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
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  gameList: {
    paddingHorizontal: 10,
    paddingTop: 20,
    alignItems: 'center', // Căn giữa danh sách
  },
  gameBox: {
    width: screenWidth / 3.5,
    height: screenWidth / 3.5,
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
  gameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
