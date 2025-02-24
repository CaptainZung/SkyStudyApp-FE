import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { API_URL } from '../../scripts/apiConfig';
import Heading from '../RootLayout/Heading';
import { useUserContext } from '../Screen/UserContext';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';

const screenWidth = Dimensions.get('window').width;

export default function TrackingProcessingScreen() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation cho biểu đồ
  const isMounted = useRef(true); // Kiểm tra component có còn mounted không

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}YourDictionaryChart/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.user }),
      });

      console.log("✅ Dữ liệu nhận gửi:", user.user);

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      const formattedStats = Object.entries(data.stats).map(([date, count]) => ({
        date: moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM'),
        count,
      }));

      if (isMounted.current) setStats(formattedStats);
    } catch (error) {
      console.error('⚠️ Lỗi tải dữ liệu:', error);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [user.user]);

  useEffect(() => {
    isMounted.current = true;
    fetchStats();

    return () => { isMounted.current = false; };
  }, [fetchStats]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  const chartData = useMemo(() => ({
    labels: stats.map((item) => item.date),
    datasets: [{ data: stats.map((item) => item.count) }],
  }), [stats]);

  return (
    <ImageBackground source={require('../../assets/images/anhnenchinh.png')} style={styles.backgroundImage}>
      <Heading title="Theo Dõi Tiến Trình" onBackPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.title}>Tổng số từ học trong tuần</Text>

        <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={250}
            yAxisSuffix=" từ"
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
            showValuesOnTopOfBars
            style={styles.chart}
          />
        </Animated.View>

        <Text style={styles.footerText}>Biểu đồ thể hiện số từ đã học mỗi ngày</Text>
      </View>
    </ImageBackground>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '6', strokeWidth: '2', stroke: '#1E90FF' },
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1E90FF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chartContainer: { width: '100%', alignItems: 'center' },
  chart: { marginVertical: 10, borderRadius: 16 },
  footerText: { marginTop: 20, fontSize: 16, color: '#000', fontStyle: 'italic' },
});
