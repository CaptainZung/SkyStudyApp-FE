import React, { useMemo } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LoadingPopup({ visible }) {
  const animation = useMemo(() => require('../../assets/animations/load.json'), []);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <LottieView source={animation} autoPlay loop style={styles.animation} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm nền mờ để nổi bật hiệu ứng
  },
  animationContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  animation: {
    width: 200, // Giữ kích thước hợp lý
    height: 200,
  },
});
