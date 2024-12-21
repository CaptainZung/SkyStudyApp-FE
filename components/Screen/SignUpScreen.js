import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { API_URL } from '../../scripts/apiConfig';

export default function SignUpScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

const handleRegister = async () => {
  if (!phone || !username || !password) {
    Alert.alert('Thiếu thông tin', 'Hãy nhập đủ số điện thoại, tên đăng nhập và mật khẩu.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}Register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, phone, password }),
    });

    const textResponse = await response.text(); // Read the raw response
    console.log('Raw server response:', textResponse); // Log response for debugging

    if (response.ok) {
      const data = JSON.parse(textResponse);
      Alert.alert('Thành công', 'Đăng ký thành công! Hãy thiết lập mã PIN.');
      navigation.navigate('EnterPin', { userId: data.user_id, username: username });
    } else {
      let errorMessage = 'Đăng ký không thành công.';
      try {
        const data = JSON.parse(textResponse);
        errorMessage = data.error || errorMessage;
      } catch (err) {
        console.warn('Error response is not JSON:', err);
      }
      Alert.alert('Lỗi', errorMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Lỗi', 'Không thể kết nối với server. Vui lòng thử lại sau.');
  }
};
  

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/images/back_icon.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Đăng ký</Text>
      </View>

      {/* Form Container */}
      <View style={styles.container}>
        <Text style={styles.formTitle}>Tài khoản mới</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Nhập tên tài khoản"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Text style={styles.eyeText}>{showPassword ? '🙉' : '🙈'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
          <Text style={styles.signupButtonText}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  eyeButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 30,
    color: '#999',
  },
  signupButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#0080FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
