import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav({ userName, avatarSource }) {
  const navigation = useNavigation();

  return (
    <View style={styles.navigationContainer}>
      {/* Home Button */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Home', { userName, avatarSource })}
        activeOpacity={0.8} // Add feedback on press
      >
        <Image
          source={require('../../assets/images/home_icon.png')}
          style={styles.navIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Camera Button */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Camera', { userName, avatarSource })}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/images/scan_icon.png')}
          style={styles.navIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Settings Button */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Setting', { userName, avatarSource })}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/images/setting_icon.png')}
          style={styles.navIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent', // Ensures nav container doesn't block background
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
    width: 40, // Slightly adjusted size for better scaling
    height: 40,
  },
});
