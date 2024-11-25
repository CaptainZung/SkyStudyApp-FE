import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function GamePlayScreen({ route, navigation }) {
  const { levelId } = route.params;

  const [sentence, setSentence] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);

  const sentences = {
    '1': { sentence: 'The dog name is Luky', translation: 'Tên chú chó là Luky!' },
    '2': { sentence: 'I love programming', translation: 'Tôi thích lập trình' },
    '3': { sentence: 'The weather is nice', translation: 'Thời tiết thật đẹp' },
    '4': { sentence: 'I like to play football', translation: 'Tôi thích chơi bóng đá' },
    '5': { sentence: 'Today is a good day', translation: 'Hôm nay là một ngày đẹp trời' },
  };

  useEffect(() => {
    const currentSentence = sentences[levelId];
    setSentence(currentSentence.sentence.split(' '));
    setShuffledWords(shuffleArray(currentSentence.sentence.split(' ')));

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) clearInterval(countdown);
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [levelId]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleSelectWord = (word) => {
    setSelectedWords([...selectedWords, word]);
    setShuffledWords(shuffledWords.filter((w) => w !== word));
  };

  const handleRemoveWord = (word) => {
    setShuffledWords([...shuffledWords, word]);
    setSelectedWords(selectedWords.filter((w) => w !== word));
  };

  const checkAnswer = () => {
    const joinedSentence = selectedWords.join(' ');
    if (joinedSentence === sentence.join(' ')) {
      setScore(timer > 30 ? 3 : timer > 0 ? 2 : 1);
    } else {
      Alert.alert('Sai rồi!', 'Câu trả lời chưa đúng, hãy thử lại!');
      setScore(0);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/anhnenchinh.png')}
      style={styles.backgroundImage}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Xếp Câu</Text>
      </View>

      {/* Đồng hồ đếm ngược */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerIcon}>⏰</Text>
        <Text style={styles.timerText}>{timer} Giây</Text>
      </View>

      {/* Câu dịch */}
      <Text style={styles.translationText}>
        {sentences[levelId]?.translation || ''}
      </Text>

      {/* Từ đã chọn */}
      <View style={styles.selectedContainer}>
        {selectedWords.map((word, index) => (
          <TouchableOpacity
            key={index}
            style={styles.wordBox}
            onPress={() => handleRemoveWord(word)}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Từ bị xáo trộn */}
      <FlatList
        data={shuffledWords}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordBox}
            onPress={() => handleSelectWord(item)}
          >
            <Text style={styles.wordText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={3}
        contentContainerStyle={styles.wordList}
      />

      {/* Nút kiểm tra */}
      <TouchableOpacity
        style={styles.checkButton}
        onPress={checkAnswer}
        disabled={timer <= 0}
      >
        <Text style={styles.checkButtonText}>Kiểm Tra</Text>
      </TouchableOpacity>

      {/* Hiển thị điểm */}
      {score > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {score === 3
              ? 'Bạn giỏi quá! 🌟🌟🌟'
              : score === 2
              ? 'Tốt lắm! 🌟🌟'
              : 'Hoàn thành! 🌟'}
          </Text>
        </View>
      )}
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
    marginTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timerIcon: {
    fontSize: 22,
    marginRight: 5,
    color: '#FFF',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  translationText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wordBox: {
    backgroundColor: '#4FAAF5',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  wordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  wordList: {
    paddingHorizontal: 20,
  },
  checkButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
