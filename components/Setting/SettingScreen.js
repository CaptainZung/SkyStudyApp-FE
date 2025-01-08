import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from '../Root/BottomNav';
import { useAvatar } from '../Root/AvatarContext';
import { useUserContext } from '../Screen/UserContext';
import Heading from '../RootLayout/Heading'; // Đã import Heading

export default function SettingScreen({ navigation, route }) {
  const { avatarSource, setAvatarSource } = useAvatar();
  const { user } = useUserContext();
  const userName = user.userName;

  const chooseImage = async () => {
    try {
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
        setAvatarSource({ uri: result.assets[0].uri }); // Update avatar in context
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while selecting the image.');
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
        {/* Heading Section */}
        <Heading title="Cài Đặt" onBackPress={() => navigation.goBack()} />

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={chooseImage}>
            <Image
              source={avatarSource ? avatarSource : require('../../assets/images/user.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
          {/* Display userName */}
          <Text style={styles.greeting}>{userName}</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.menuButtonText}>Thông tin cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Tracking')}>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
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
    marginTop:100,
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
