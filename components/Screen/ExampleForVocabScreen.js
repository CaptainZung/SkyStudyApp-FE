import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ExampleForVocabScreen({ route }) {
  const { wordData } = route.params;
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Go back to previous screen
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{wordData.word}</Text>
      </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10, // Added padding for more spacing
    backgroundColor: '#00BCD4',
    marginTop: 15, // Adds space between the header and the top of the screen
  },
  backButton: {
    marginRight: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
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
    color: '#FFD700', // Yellow color for the word
    marginBottom: 10, // Adds spacing below the word
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
    height: 300, // Fixed height for the image container
    borderRadius: 15,
    overflow: 'hidden', // Ensures the image fits within the frame
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
    resizeMode: 'cover', // Ensures the image fills the container proportionally
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
