import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [segmentedImage, setSegmentedImage] = useState(null);

  const uploadPhoto = async () => {
    // Chọn ảnh từ thư viện
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      const formData = new FormData();
      formData.append('file', {
        uri: result.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      try {
        const response = await fetch('http://enhanced-snake-externally.ngrok-free.app/predict', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.ok) {
          throw new Error('Server response error');
        }

        // Chuyển dữ liệu nhị phân từ server thành Blob
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Hiển thị ảnh đã được phân đoạn
        setSegmentedImage(imageUrl);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Photo" onPress={uploadPhoto} />
      {segmentedImage && (
        <Image source={{ uri: segmentedImage }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
  },
});
