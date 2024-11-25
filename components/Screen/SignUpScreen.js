import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    if (!phone || !username || !password) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    // Thêm logic gửi dữ liệu đăng ký lên server
    console.log('Phone:', phone, 'Username:', username, 'Password:', password);
    alert('Đăng ký thành công!');
    navigation.goBack(); // Quay lại màn hình đăng nhập
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background_signup.png')} // Thay bằng đường dẫn ảnh nền
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Tài khoản mới</Text>

        {/* Nhập số điện thoại */}
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Nhập tên đăng nhập */}
        <TextInput
          style={styles.input}
          placeholder="Nhập tên đăng nhập"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        {/* Nhập mật khẩu */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Nút đăng ký */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Đăng Kí</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  eyeButton: {
    padding: 10,
  },
  eyeText: {
    fontSize: 16,
    color: '#999',
  },
  signupButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#0080FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
