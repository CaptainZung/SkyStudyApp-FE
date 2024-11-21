import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../scripts/apiConfig';

export default function VerifyOTP({ route, navigation }) {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleVerifyOTP = async () => {
    if (!otp || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập OTP và mật khẩu.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Thành công', 'Tạo tài khoản thành công.');
        navigation.navigate('NameInput');
      } else {
        Alert.alert('Lỗi', data.error || 'Xác thực OTP thất bại.');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Không thể kết nối với server: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, width: '80%', marginBottom: 20, padding: 10 },
  button: { backgroundColor: '#1E90FF', padding: 15, borderRadius: 5 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});
