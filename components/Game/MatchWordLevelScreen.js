import React from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Heading from '../RootLayout/Heading'; // Import Heading component

const screenWidth = Dimensions.get('window').width;

export default function MatchWordLevelScreen({ route, navigation }) {
  const { gameId } = route.params; // Nhận gameId từ navigation

  // Danh sách các màn chơi
  const levels = [
    { id: '1', name: 'Màn 1', image: require('../../assets/images/level1.png') },
    { id: '2', name: 'Màn 2', image: require('../../assets/images/level2.png') },
    { id: '3', name: 'Màn 3', image: require('../../assets/images/level3.png') },
    { id: '4', name: 'Màn 4', image: require('../../assets/images/level4.png') },
    { id: '5', name: 'Màn 5', image: require('../../assets/images/level5.png') },
  ];

  const renderLevelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.levelBox}
      onPress={() => navigation.navigate('MatchWord', { levelId: item.id })}
    >
      <Image source={item.image} style={styles.levelImage} />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Header được thay thế bằng Heading */}
      <Heading title="Chọn Màn Chơi" onBackPress={() => navigation.goBack()} />

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
  levelList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  levelBox: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelImage: {
    width: screenWidth / 2.5, // Đặt kích thước hình ảnh theo nhu cầu
    height: screenWidth / 3, // Tỉ lệ phù hợp
    resizeMode: 'contain', // Đảm bảo hình ảnh giữ nguyên tỉ lệ
    borderRadius: 15,
  },
});
