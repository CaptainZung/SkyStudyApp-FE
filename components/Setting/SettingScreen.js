import React, { useCallback, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert, Animated 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from '../Root/BottomNav';
import { useAvatar } from '../Root/AvatarContext';
import { useUserContext } from '../Screen/UserContext';
import Heading from '../RootLayout/Heading';

export default function SettingScreen({ navigation }) {
  const { avatarSource, setAvatarSource } = useAvatar();
  const { user } = useUserContext();
  const userName = user?.username || 'Người dùng'; 

  const scaleAnim = useRef(new Animated.Value(1)).current; 
  const fadeAnim = useRef(new Animated.Value(1)).current; // Animation cho avatar

  // 🟢 Kiểm tra quyền truy cập thư viện ảnh
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền để chọn ảnh.');
      return false;
    }
    return true;
  };

  // 🟢 Hàm chọn ảnh từ thư viện
  const chooseImage = useCallback(async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Image, // ✅ Sửa MediaTypeOptions -> MediaType
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.assets || result.assets.length === 0) {
        Alert.alert('Thông báo', 'Bạn chưa chọn ảnh nào.');
        return;
      }

      setAvatarSource({ uri: result.assets[0].uri });

      // 🔥 Hiệu ứng avatar khi chọn ảnh
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } catch (error) {
      Alert.alert('Lỗi', `Không thể chọn ảnh.\nChi tiết: ${error.message}`);
    }
  }, []);

  // 🟢 Xử lý đăng xuất
  const handleLogout = useCallback(() => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) },
    ]);
  }, [navigation]);

  return (
    <ImageBackground source={require('../../assets/images/anhnenchinh.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Heading Section */}
        <Heading title="Cài Đặt" onBackPress={() => navigation.goBack()} />

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}>
            <TouchableOpacity onPress={chooseImage} activeOpacity={0.8}>
              <Image 
                source={avatarSource?.uri ? { uri: avatarSource.uri } : require('../../assets/images/user.png')} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.greeting}>{userName}</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsWrapper}>
          {[
            { label: 'Thông tin cá nhân', screen: 'Profile' },
            { label: 'Theo dõi tiến trình', screen: 'Tracking' },
            { label: 'Điều khoản & chính sách', screen: 'Policy' },
            { label: 'Đăng xuất', screen: 'Logout', action: handleLogout },
          ].map((item, index) => (
            <Animated.View key={index} style={styles.animatedButtonContainer}>
              <TouchableOpacity 
                style={styles.menuButton} 
                onPress={item.action || (() => navigation.navigate(item.screen))}
                activeOpacity={0.7}
              >
                <Text style={styles.menuButtonText}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Bottom Navigation */}
      <BottomNav />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
  profileSection: { alignItems: 'center', marginTop: 100, marginBottom: 30 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: '#FFF' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 10 },
  buttonsWrapper: { width: '80%', marginTop: 30 },
  menuButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuButtonText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
  animatedButtonContainer: { transform: [{ scale: 1 }] },
});
