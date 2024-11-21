import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../scripts/apiConfig';

export default function SendOTP({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Thành công', 'OTP đã được gửi.');
        navigation.navigate('VerifyOTP', { phoneNumber });
      } else {
        Alert.alert('Lỗi', data.error || 'Gửi OTP thất bại.');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Không thể kết nối với server: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập số điện thoại của bạn</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Gửi OTP</Text>
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
