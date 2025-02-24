import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { API_URL } from '../../scripts/apiConfig';
import { useUserContext } from '../Screen/UserContext';

const screenWidth = Dimensions.get('window').width;

export default function UserInfoScreen() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}UserInfomation/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.user }),
      });
      console.log("✅ Dữ liệu nhận gửi:", user.user);
      if (!response.ok) throw new Error('Failed to fetch user info');

      const data = await response.json();
      console.log("✅ Dữ liệu nhận được:", data);
      setUserInfo(data);
    } catch (error) {
      console.error('⚠️ Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  }, [user.username]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông Tin Người Dùng</Text>
      {userInfo?.avatar ? (
        <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
      ) : (
        <Text style={styles.noAvatar}>Không có ảnh đại diện</Text>
      )}
      <Text style={styles.infoText}>Tên người dùng: {userInfo?.username}</Text>
      <Text style={styles.infoText}>Số điện thoại: {userInfo?.phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1E90FF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: screenWidth * 0.4, height: screenWidth * 0.4, borderRadius: screenWidth * 0.2, marginBottom: 20 },
  noAvatar: { fontSize: 16, color: '#999', marginBottom: 20 },
  infoText: { fontSize: 18, marginBottom: 10 },
});
