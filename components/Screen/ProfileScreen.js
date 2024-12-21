import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { API_URL } from '../../scripts/apiConfig';

export default function ProfileScreen({ route }) {
  const [userData, setUserData] = useState({
    username: '',
    phone: '',
    pin: '',
    password: '',
  });
  const [showPin, setShowPin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/profile`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          Alert.alert('Lỗi', 'Không thể tải thông tin tài khoản.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể kết nối với máy chủ.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Thông Tin Cá Nhân</Text>

        {/* Username */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tên đăng nhập:</Text>
          <Text style={styles.value}>{userData.username}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('Sửa tên đăng nhập')}>
            <Text style={styles.editText}>Sửa</Text>
          </TouchableOpacity>
        </View>

        {/* Phone */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{userData.phone}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('Sửa số điện thoại')}>
            <Text style={styles.editText}>Sửa</Text>
          </TouchableOpacity>
        </View>

        {/* PIN */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Mã PIN:</Text>
          <Text style={styles.value}>{showPin ? userData.pin : '******'}</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPin(!showPin)}
          >
            <Text style={styles.toggleText}>{showPin ? 'Ẩn' : 'Hiện'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('Sửa mã PIN')}>
            <Text style={styles.editText}>Sửa</Text>
          </TouchableOpacity>
        </View>

        {/* Password */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Mật khẩu:</Text>
          <Text style={styles.value}>{showPassword ? userData.password : '********'}</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.toggleText}>{showPassword ? 'Ẩn' : 'Hiện'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('Sửa mật khẩu')}>
            <Text style={styles.editText}>Sửa</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  value: {
    fontSize: 18,
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
  toggleButton: {
    backgroundColor: '#1E90FF',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  toggleText: {
    color: '#FFF',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#FF4500',
    padding: 5,
    borderRadius: 5,
  },
  editText: {
    color: '#FFF',
    fontSize: 14,
  },
});
