import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Heading from '../RootLayout/Heading'; // Import Heading component
import { useNavigation } from '@react-navigation/native';

export default function ExampleForVocabScreen({ route }) {
  const { wordData } = route.params;
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Sử dụng Heading component */}
      <Heading title={wordData.word} onBackPress={() => navigation.goBack()} />

      {/* Content */}
      <View style={styles.container}>
        <Text style={styles.word}>{wordData.word}</Text>
        <Text style={styles.translation}>{wordData.vietnamese}</Text>

        <View style={styles.examplesContainer}>
          {wordData.examples.map((example, index) => (
            <Text key={index} style={styles.example}>
              {example}
            </Text>
          ))}
        </View>

        {wordData.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: wordData.image }}
              style={styles.image}
            />
          </View>
        )}

        {/* Practice Speaking Button */}
        <TouchableOpacity
          style={styles.practiceButton}
          onPress={() =>
            navigation.navigate('PracticeSpeaking', {
              referenceText: wordData.examples[0], // Pass the first example as reference
            })
          }
        >
          <Text style={styles.practiceButtonText}>Luyện phát âm</Text>
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
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  word: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700', // Màu vàng cho từ vựng
    marginBottom: 10,
    textAlign: 'center',
  },
  translation: {
    fontSize: 28,
    color: '#FFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  examplesContainer: {
    width: '90%',
    marginBottom: 20,
  },
  example: {
    fontSize: 20,
    color: '#000',
    marginVertical: 10,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 15,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '90%',
    height: 300, // Chiều cao cố định cho khung ảnh
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Đảm bảo ảnh vừa với khung hình
  },
  practiceButton: {
    backgroundColor: '#0080FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  practiceButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
