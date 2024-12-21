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
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from './BottomNav';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const initialUserName = route?.params?.userName ?? 'Guest';
  const [userName, setUserName] = useState(initialUserName);
  const [avatarSource, setAvatarSource] = useState(null);
  const [kpiDays, setKpiDays] = useState({
    Sun: false,
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
  });
  const [currentDay, setCurrentDay] = useState('');
  const bannerScale = useRef(new Animated.Value(1)).current;

  const getCurrentDay = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    return days[today];
  };

  useEffect(() => {
    const today = getCurrentDay();
    setCurrentDay(today);

    const timer = setTimeout(() => {
      setKpiDays((prevState) => ({ ...prevState, [today]: true }));
    },30 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

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
      setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
      Animated.sequence([
        Animated.timing(bannerScale, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bannerScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: screenWidth * (currentIndex + 1), animated: true });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ImageBackground source={require('../../assets/images/anhnenchinh.png')} style={styles.backgroundImage}>


      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={chooseImage}>
          <Image source={avatarSource ? avatarSource : require('../../assets/images/user.png')} style={styles.avatar} />
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.greeting}>Hello {userName}</Text>
        </View>
      </View>

      <View style={styles.bannerWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerContainer}
        >
          {banners.map((banner, index) => (
            <Animated.View
              key={index}
              style={[styles.banner, { transform: [{ scale: bannerScale }] }]}
            >
              <Image source={banner.image} style={styles.bannerImage} />
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.daysContainer}>
        {Object.keys(kpiDays).map((day) => (
          <View key={day} style={[styles.day, kpiDays[day] && styles.dayCompleted]}>
            <Text style={[styles.dayText, kpiDays[day] && styles.dayTextCompleted]}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={() => navigation.navigate('EnglishByTopic')}>
          <Image source={require('../../assets/images/englishbytopic_icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>English by topic</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={() => navigation.navigate('Game')}>
          <Image source={require('../../assets/images/game_icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Playing Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={() => navigation.navigate('Dictionary')}>
          <Image source={require('../../assets/images/dictionary_icon.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Your Dictionary</Text>
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
    top: 50,
    right: 20,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
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
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoContainer: {
    marginLeft: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  points: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 5,
  },
  bannerWrapper: {
    marginTop: 120,
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
    borderRadius: 10,
  },
  daysContainer: {
    flexDirection: 'row', // Căn theo hàng ngang
    justifyContent: 'space-around', // Khoảng cách đều giữa các ngày
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10, // Khoảng cách bên trong container
    marginTop: 15,
    marginBottom: 15,
  },
  day: {
    width: 40, // Kích thước hình tròn
    height: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25, // Để thành hình tròn
    elevation: 5,
    marginHorizontal: 5, // Khoảng cách giữa các ngày
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  dayCompleted: {
    backgroundColor: '#4CAF50', // Màu xanh khi hoàn thành
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  dayTextCompleted: {
    color: '#FFF', // Màu trắng khi hoàn thành
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00BCD4', // Màu xanh
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
    fontWeight: 'bold',
  },
});
