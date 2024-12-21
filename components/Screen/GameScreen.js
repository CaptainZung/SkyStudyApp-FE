import React, { useEffect, useState } from 'react';
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
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';
import BottomNav from './BottomNav'; // Import BottomNav component if needed

const screenWidth = Dimensions.get('window').width;

export default function GameScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Check if the screen is currently focused
  const [sound, setSound] = useState();

  // Function to play background music
  async function playBackgroundMusic() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sound/videoplayback.mp3') // Path to your background music file
      );
      setSound(sound);
      await sound.setIsLoopingAsync(true); // Enable looping
      await sound.playAsync(); // Play the music
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }

  // Function to stop background music
  async function stopBackgroundMusic() {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null); // Clear the sound state
    }
  }

  // Play or stop the music based on screen focus
  useEffect(() => {
    if (isFocused) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }

    // Cleanup in case the component unmounts while music is playing
    return () => {
      stopBackgroundMusic();
    };
  }, [isFocused]);

  // List of games
  const games = [
    { id: '1', name: 'Game 1', image: require('../../assets/images/game1.png') },
    { id: '2', name: 'Game 2', image: require('../../assets/images/game2.png') },
    { id: '3', name: 'Game 3', image: require('../../assets/images/game3.png') },
    { id: '4', name: 'Game 4' },
    { id: '5', name: 'Game 5' },
    { id: '6', name: 'Game 6' },
  ];

  // Render each game item
  const renderGameItem = ({ item }) => {
    const navigateToGame = () => {
      switch (item.id) {
        case '1':
          navigation.navigate('MatchWordLevel', { gameId: item.id });
          break;
        case '2':
          navigation.navigate('GuessTheWord', { gameId: item.id });
          break;
        case '3':
          navigation.navigate('ListenToGuess');
          break;
        default:
          alert('This feature is not implemented yet!');
      }
    };

    return (
      <TouchableOpacity style={styles.gameBox} onPress={navigateToGame}>
        {item.image ? (
          <Image source={item.image} style={styles.gameImage} />
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.gameText}>{item.name}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')} // Background image
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Go back to the previous screen
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Playing Game</Text>
      </View>

      {/* List of games */}
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Two buttons per row
        contentContainerStyle={styles.gameList}
      />

      {/* Bottom Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/images/home_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Camera')}>
          <Image source={require('../../assets/images/scan_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('../../assets/images/setting_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
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
    width: (screenWidth - 40) / 2, // Dividing the screen width into two buttons per row
    height: ((screenWidth - 40) / 2) * (9 / 16), // Aspect ratio 16:9
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center',
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
