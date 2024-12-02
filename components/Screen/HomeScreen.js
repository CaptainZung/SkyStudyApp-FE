import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from './BottomNav';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const initialUserName = route?.params?.userName ?? 'Guest'; // Get the userName from params or fallback to 'Guest'
  const [userName, setUserName] = useState(initialUserName); // Persist userName in state
  const [avatarSource, setAvatarSource] = useState(null);

  const chooseImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'You need to allow access to your media library to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarSource({ uri: result.assets[0].uri });
    }
  };

  const banners = [
    { image: require('../../assets/images/banner1.jpg') },
    { image: require('../../assets/images/banner2.jpg') },
    { image: require('../../assets/images/banner3.jpg') },
  ];

  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: screenWidth * (currentIndex + 1), animated: true });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ImageBackground source={require('../../assets/images/anhnenchinh.png')} style={styles.backgroundImage}>
      {/* Nút Micro */}
      <TouchableOpacity
        style={styles.microButton}
        onPress={() => navigation.navigate('Micro')}
      >
        <Text style={styles.microButtonText}>Micro</Text>
      </TouchableOpacity>

      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={chooseImage}>
          <Image source={avatarSource ? avatarSource : require('../../assets/images/flip.png')} style={styles.avatar} />
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.greeting}>Hello {userName}</Text>
          <Text style={styles.points}>0 points</Text>
        </View>
      </View>

      <View style={styles.bannerWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerContainer}
          onScroll={(event) => {
            const scrollPosition = event.nativeEvent.contentOffset.x;
            const index = Math.floor(scrollPosition / screenWidth);
            setCurrentIndex(index);
          }}
        >
          {banners.map((banner, index) => (
            <View key={index} style={styles.banner}>
              <Image source={banner.image} style={styles.bannerImage} />
              <Text style={styles.bannerText}>{banner.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.daysContainer}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
          <View key={day} style={styles.day}>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EnglishByTopic')}>
          <Image source={require('../../assets/images/englishbytopic_icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Tiếng anh theo chủ đề</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Game')}>
          <Image source={require('../../assets/images/game_icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Chơi game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dictionary')}>
          <Image source={require('../../assets/images/dictionary_icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Từ điển của bạn</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  microButton: {
    position: 'absolute',
    top: 50, // Adjust to fit your layout
    right: 20,
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 10,
  },
  microButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatarSection: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ccc',
  },
  infoContainer: {
    marginLeft: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  points: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 5,
  },
  bannerWrapper: {
    marginTop: 90,
  },
  bannerContainer: {
    height: 220,
    marginBottom: 10,
  },
  banner: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerText: {
    fontSize: 18,
    color: '#FFF',
    position: 'absolute',
    bottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  day: {
    width: 60,
    height: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00BCD4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});
