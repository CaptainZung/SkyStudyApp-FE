import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import BottomNav from '../Root/BottomNav';
import { useAvatar } from '../Root/AvatarContext';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const { avatarSource, setAvatarSource } = useAvatar();
  const userName = route?.params?.userName ?? 'Guest';

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
  const scrollViewRef = useRef(null);
  const currentIndexRef = useRef(0);

  // Xác định ngày hiện tại
  useEffect(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    setCurrentDay(days[today]);

    setTimeout(() => {
      setKpiDays((prev) => ({ ...prev, [days[today]]: true }));
    }, 30 * 60 * 1000);
  }, []);

  // Chọn ảnh đại diện
  const chooseImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Denied', 'Bạn cần cấp quyền truy cập thư viện ảnh.');
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
    } catch (error) {
      Alert.alert('Error', 'Lỗi khi chọn ảnh.');
    }
  };

  // Banner images and auto-scroll logic
  const banners = [
    { image: require('../../assets/images/banner1.jpg') },
    { image: require('../../assets/images/banner2.jpg') },
    { image: require('../../assets/images/banner3.jpg') },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % banners.length;
      Animated.sequence([
        Animated.timing(bannerScale, { toValue: 1.1, duration: 300, useNativeDriver: true }),
        Animated.timing(bannerScale, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      scrollViewRef.current?.scrollTo({ x: screenWidth * currentIndexRef.current, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground source={require('../../assets/images/anhnenchinh.png')} style={styles.backgroundImage}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={chooseImage} activeOpacity={0.8}>
          <Image source={avatarSource || require('../../assets/images/user.png')} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.greeting}>Hello {userName}</Text>
        </View>
      </View>

      {/* Banner Section */}
      <View style={styles.bannerWrapper}>
        <ScrollView ref={scrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
          {banners.map((banner, index) => (
            <Animated.View key={index} style={[styles.banner, { transform: [{ scale: bannerScale }] }]}>
              <Image source={banner.image} style={styles.bannerImage} />
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* KPI Days Section */}
      <View style={styles.daysContainer}>
        {Object.keys(kpiDays).map((day) => (
          <View key={day} style={[styles.day, kpiDays[day] && styles.dayCompleted]}>
            <Text style={[styles.dayText, kpiDays[day] && styles.dayTextCompleted]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        {[
          { name: 'EnglishByTopic', label: 'Tiếng Anh theo chủ đề', icon: require('../../assets/images/englishbytopic_icon.png') },
          { name: 'Game', label: 'Chơi game', icon: require('../../assets/images/game_icon.png') },
          { name: 'Dictionary', label: 'Từ điển của bạn', icon: require('../../assets/images/dictionary_icon.png') },
        ].map((item) => (
          <TouchableOpacity key={item.name} style={styles.button} onPress={() => navigation.navigate(item.name)}>
            <Image source={item.icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <BottomNav />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  avatarSection: { position: 'absolute', top: 50, left: 20, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: '#FFF' },
  infoContainer: { marginLeft: 15 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  bannerWrapper: { marginTop: 120 },
  bannerContainer: { height: 220, marginBottom: 10 },
  banner: { width: screenWidth, alignItems: 'center', justifyContent: 'center' },
  bannerImage: { width: '100%', height: '100%', borderRadius: 10 },
  daysContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  day: { width: 40, height: 50, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', borderRadius: 25, elevation: 5 },
  dayCompleted: { backgroundColor: '#4CAF50' },
  buttonsContainer: { alignItems: 'center', marginBottom: 30 },
  button: { flexDirection: 'row', backgroundColor: '#2196F3', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, alignItems: 'center', marginBottom: 15, width: '80%', justifyContent: 'center' },
  buttonIcon: { width: 24, height: 24, marginRight: 10 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
});

