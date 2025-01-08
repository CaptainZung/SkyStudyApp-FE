import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { API_URL } from '../../scripts/apiConfig';
import Heading from '../RootLayout/Heading';
import { useUserContext } from '../Screen/UserContext'; // Import UserContext
import { useNavigation } from '@react-navigation/native'; // Sử dụng useNavigation
import moment from 'moment-timezone'; // Import moment-timezone

const screenWidth = Dimensions.get('window').width;

export default function TrackingProcessingScreen() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const navigation = useNavigation(); // Lấy navigation từ hook useNavigation

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}YourDictionaryChart/`, {
          method: 'POST', // Sử dụng POST thay vì GET
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: user.user }), // Truyền dữ liệu trong body
        });

        if (response.ok) {
          const data = await response.json();
          const formattedStats = Object.entries(data.stats).map(([date, count]) => ({
            date: moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM'), // Chuyển đổi thời gian về giờ Việt Nam
            count,
          }));
          setStats(formattedStats);
        } else {
          console.error('Failed to fetch stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  const maxValue = Math.max(...stats.map((item) => item.count), 1);
  const chartData = {
    labels: stats.map((item) => item.date), // Dùng ngày và giờ đã chuyển đổi
    datasets: [
      {
        data: stats.map((item) => item.count),
      },
    ],
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      <Heading title="Tracking Progress" onBackPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.title}>Thời Gian Chơi Game</Text>
        <BarChart
              data={chartData}
              width={screenWidth - 40}
              height={250}
              yAxisLabel=""
              yAxisSuffix=" từ"
              chartConfig={chartConfig}
              verticalLabelRotation={45} // Rotate labels to fit better
              fromZero
              showValuesOnTopOfBars
              style={{
                marginVertical: 10,
                borderRadius: 16,
                paddingBottom: 20, // Add padding to avoid cutoff
              }}
            />
        <Text style={styles.footerText}>Biểu đồ tuần thể hiện số từ đã học</Text>
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
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#1E90FF',
  },
};

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
    marginBottom: 20,
    color: '#1E90FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
    fontStyle: 'italic',
  },
});
