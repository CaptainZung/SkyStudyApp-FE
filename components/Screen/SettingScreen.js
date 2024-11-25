import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from './BottomNav';

export default function SettingScreen({ navigation, route }) {
  // Safely extract `userName` and provide a default value
  const initialUserName = route?.params?.userName ?? 'Guest';
  const [userName, setUserName] = useState(initialUserName);
  const [avatarSource, setAvatarSource] = useState(null); // Avatar state

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

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], // Clear stack and navigate to Login
          });
        },
      },
    ]);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={chooseImage}>
            <Image
              source={avatarSource ? avatarSource : require('../../assets/images/flip.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
          {/* Display userName */}
          <Text style={styles.greeting}>{userName}</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Thông tin cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Theo dõi tiến trình</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Điều khoản & chính sách</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
            <Text style={styles.menuButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonsWrapper: {
    width: '80%',
    marginTop: 30,
  },
  menuButton: {
    backgroundColor: '#4FAAF5',
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
