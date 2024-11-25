import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
    <View style={styles.gameItem}>
      <TouchableOpacity style={styles.gameBox}>
        <Text style={styles.gameText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.topLeftButton} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/images/back_icon.png')} style={styles.icon} />
      </TouchableOpacity>

      <Text style={styles.headerText}>Playing Game</Text>

      {/* Hiển thị các ô trò chơi */}
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.gameList}
      />

      {/* Điều hướng dưới cùng */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/images/home_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Camera')}>
          <Image source={require('../assets/images/scan_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('../assets/images/setting_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Màu nền xanh trời
    paddingTop: 50,
  },
  topLeftButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  gameList: {
    paddingHorizontal: 10,
  },
  gameItem: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameBox: {
    width: screenWidth / 3.5,
    height: screenWidth / 3.5,
    backgroundColor: '#D3D3D3',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  gameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  navIcon: {
    width: 48,
    height: 48,
  },
});
