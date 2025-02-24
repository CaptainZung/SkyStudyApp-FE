import React, { useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

export default function Heading({ title, onBackPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current; // 🔥 Thêm opacity để hiệu ứng mượt hơn

  useEffect(() => {
    scaleAnim.setValue(1);
    opacityAnim.setValue(1);
  }, []);

  const handlePress = useCallback(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]),
      Animated.timing(opacityAnim, { toValue: 0.7, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      opacityAnim.setValue(1);
      onBackPress();
    });
  }, [onBackPress]);

  return (
    <View style={styles.header}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
        <TouchableOpacity onPress={handlePress} style={styles.backButton} activeOpacity={0.7}>
          <Image source={require('../../assets/images/back_icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1E90FF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    elevation: 1,
  },
  backIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
