import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { API_URL } from '../../scripts/apiConfig';

export default function EnterPinScreen({ route, navigation }) {
  const [pin, setPin] = useState('');
  const { userId, username } = route.params; // Get userId and username from previous screen

  const handleUpdatePin = async () => {
    // Validate PIN
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      Alert.alert('Lỗi', 'Mã PIN phải gồm đúng 6 chữ số.');
      return;
    }

    try {
      console.log('Sending data to API:', { username, pin }); // Debugging
      const response = await fetch(`${API_URL}User/UpdatePin/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin }), // Send username and pin
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Thiết lập mã PIN thành công!');
        navigation.navigate('Login'); // Redirect to login screen
      } else {
        console.warn('Error from server:', data);
        Alert.alert('Lỗi', data.error || 'Không thể thiết lập mã PIN.');
      }
    } catch (error) {
      console.error('API connection error:', error);
      Alert.alert('Lỗi', 'Không thể kết nối với server. Vui lòng thử lại sau.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Nhập mã PIN gồm 6 chữ số</Text>
        <TextInput
          style={styles.input}
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={6}
          placeholder="Nhập mã PIN"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdatePin}>
          <Text style={styles.buttonText}>Hoàn tất</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#0080FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
