import React, { useCallback } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav({ userName, avatarSource }) {
  const navigation = useNavigation();
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(1);

  const handleNavigate = useCallback((screen) => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0.7, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start(() => navigation.navigate(screen, { userName, avatarSource }));
    });
  }, [navigation, userName, avatarSource]);

  return (
    <LinearGradient 
      colors={['#2FB8FF', '#9EECD9']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}
      style={styles.navigationContainer}
    >
      {/* Home Button */}
      <Animated.View style={[styles.navItem, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
        <TouchableOpacity onPress={() => handleNavigate('Home')} activeOpacity={0.8}>
          <Image source={require('../../assets/images/home_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* Camera Button */}
      <Animated.View style={[styles.navItem, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
        <TouchableOpacity onPress={() => handleNavigate('Camera')} activeOpacity={0.8}>
          <Image source={require('../../assets/images/scan_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* Settings Button */}
      <Animated.View style={[styles.navItem, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
        <TouchableOpacity onPress={() => handleNavigate('Setting')} activeOpacity={0.8}>
          <Image source={require('../../assets/images/setting_icon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  navIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
