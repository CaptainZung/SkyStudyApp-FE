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
  Platform,
  StatusBar,
} from 'react-native';
import Heading from '../RootLayout/Heading'; // Import Heading component
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';

const screenWidth = Dimensions.get('window').width;

export default function GameScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Kiểm tra xem màn hình có đang được focus không
  const [sound, setSound] = useState();

  async function playBackgroundMusic() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sound/videoplayback.mp3')
      );
      setSound(sound);
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }

  async function stopBackgroundMusic() {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  }

  useEffect(() => {
    if (isFocused) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }

    return () => {
      stopBackgroundMusic();
    };
  }, [isFocused]);

  const games = [
    { id: '1', name: 'Game 1', image: require('../../assets/images/game1.png') },
    { id: '2', name: 'Game 2', image: require('../../assets/images/game2.png') },
    { id: '3', name: 'Game 3', image: require('../../assets/images/game3.png') },
    { id: '4', name: 'Game 4' },
    { id: '5', name: 'Game 5' },
    { id: '6', name: 'Game 6' },
  ];

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
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Sử dụng Heading component */}
      <Heading title="Playing Game" onBackPress={() => navigation.goBack()} />

      {/* List of games */}
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gameList}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gameList: {
    paddingHorizontal: 5,
    paddingTop: 20,
    justifyContent: 'center', // Căn giữa danh sách các game
  },
  gameBox: {
    width: (screenWidth - 50) / 2, // Đảm bảo cân bằng giữa các cột
    height: ((screenWidth - 50) / 2) * (9 / 16),
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: '#FFF',
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
