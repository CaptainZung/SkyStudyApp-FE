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

  // List of games
  const games = [
    { id: '1', name: 'Game 1', image: require('../../assets/images/game1.png') },
    { id: '2', name: 'Game 2', image: require('../../assets/images/game2.png') },
    { id: '3', name: 'Game 3', image: require('../../assets/images/game3.png') },
    { id: '4', name: 'Game 4' },
    { id: '5', name: 'Game 5' },
    { id: '6', name: 'Game 6' },
  ];

  // Navigate to specific game based on ID
  const navigateToGame = (gameId) => {
    switch (gameId) {
      case '1':
        navigation.navigate('LevelScreen', { gameId });
        break;
      case '2':
        navigation.navigate('GuessTheWord', { gameId });
        break;
      case '3':
        navigation.navigate('ListenToGuess', { gameId });
        break;
      default:
        alert('This feature is not yet implemented!');
    }
  };

  // Render each game item
  const renderGameItem = ({ item }) => (
    <TouchableOpacity style={styles.gameBox} onPress={() => navigateToGame(item.id)}>
      {item.image ? (
        <Image source={item.image} style={styles.gameImage} />
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.gameText}>{item.name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')} // Background image
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Playing Game</Text>
      </View>

      {/* Game List */}
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Two columns
        contentContainerStyle={styles.gameList}
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
  gameList: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  gameBox: {
    width: (screenWidth - 40) / 2, // Adjust size to fit 2 columns
    height: ((screenWidth - 40) / 2) * (9 / 16), // Maintain 16:9 aspect ratio
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden', // To apply border radius to images
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gameImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#4FAAF5',
  },
  gameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
