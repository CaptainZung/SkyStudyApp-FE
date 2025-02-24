import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { API_URL } from '../../scripts/apiConfig';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av'; // Import thư viện Audio
import { useUserContext } from '../Screen/UserContext';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const titleAnimation = new Animated.Value(0);
  const [sound, setSound] = useState();

  // Hiệu ứng chữ SkyStudy
  useEffect(() => {
    Animated.timing(titleAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Hiệu ứng chữ SkyStudy dịch chuyển
  const titleTranslateY = titleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0], // SkyStudy sẽ di chuyển từ trên xuống
  });

  // Hàm phát nhạc nền
  async function playBackgroundMusic() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sound/videoplayback.mp3') // Đường dẫn tới tệp nhạc nền
      );
      setSound(sound);
      await sound.setIsLoopingAsync(true); // Bật chế độ lặp
      await sound.playAsync(); // Phát nhạc
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }

  // Hàm ngừng phát nhạc khi chuyển sang màn hình khác
  async function stopBackgroundMusic() {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  }

  // Phát nhạc khi màn hình được render
  useEffect(() => {
    playBackgroundMusic();
    return () => {
      stopBackgroundMusic();
    };
  }, []);
  const { setUser } = useUserContext(); // Truy cập hàm setUser từ UserContext
  // Xử lý đăng nhập
  const handleLogin = async () => {
    if (username.trim() && password.trim()) {
      try {
        const response = await fetch(`${API_URL}Login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          stopBackgroundMusic(); // Dừng nhạc khi chuyển màn hình
  
          // Lưu username vào Context
          const userData = {
            user: username,
          };
          setUser(userData);
  
          // In ra console
          console.log('User data saved to context:', userData);
  
          navigation.navigate('Home', { userName: username });
        } else {
          Alert.alert('Đăng nhập thất bại', 'Tài khoản hoặc mật khẩu không đúng');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể kết nối server. Vui lòng thử lại sau.');
        console.error('Error during login:', error);
      }
    } else {
      Alert.alert('Thiếu thông tin', 'Hãy nhập cả tên đăng nhập và mật khẩu.');
    }
  };

  // Xử lý đăng nhập khách
  const handleGuestLogin = () => {
    stopBackgroundMusic(); // Dừng nhạc khi chuyển màn hình
    navigation.navigate('NameInput');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnen.jpg')}
      style={styles.backgroundImage}
    >
      <StatusBar hidden />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Hiệu ứng chữ SkyStudy */}
        <Animated.View style={[styles.titleContainer, { transform: [{ translateY: titleTranslateY }] }]}>
          <Text style={styles.title}>SkyStudy</Text>
        </Animated.View>

        <TextInput
          style={styles.input}
          placeholder="Nhập tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="gray"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="gray"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>{showPassword ? '🙉' : '🙈'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGuestLogin}>
          <Text style={styles.link}>Đăng nhập với tư cách là khách</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.signUpTextContainer}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.signUpText}>Tạo tài khoản mới</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FF6347',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  passwordInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
  },
  eyeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  eyeText: {
    fontSize: 20,
    color: '#999',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: 'orange',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  signUpTextContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  signUpText: {
    color: 'red',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
