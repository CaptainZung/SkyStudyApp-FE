import React, { useState } from 'react';
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
} from 'react-native';
import { API_URL } from '../../scripts/apiConfig';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle regular login
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
          navigation.navigate('Home', { userName: username });
        } else {
          Alert.alert('Đăng nhập thất bại', 'Tài khoản hoặc mật khẩu không đúng');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể kết nối server. Vui lòng thử lại sau.');
      }
    } else {
      Alert.alert('Thiếu thông tin', 'Hãy nhập cả tên đăng nhập và mật khẩu.');
    }
  };

  // Handle guest login
  const handleGuestLogin = () => {
    navigation.navigate('NameInput'); // Navigate to NameInput screen for entering a guest name
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnen.jpg')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>SkyStudy</Text>

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
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
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
    justifyContent: 'space-between', // Align TextInput and eye icon properly
  },
  passwordInput: {
    flex: 1, // Fill available space in the container
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
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: 'yellow',
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
  },
});
