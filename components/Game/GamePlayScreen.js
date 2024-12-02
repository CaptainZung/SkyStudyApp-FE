import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  Modal,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function GamePlayScreen({ route, navigation }) {
  const { levelId } = route.params;

  const [sentence, setSentence] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const sentences = {
    "1": { sentence: "The dog name is Luky", translation: "Tên chú chó là Luky!" },
    "2": { sentence: "I love programming", translation: "Tôi thích lập trình" },
    "3": { sentence: "The weather is nice", translation: "Thời tiết thật đẹp" },
    "4": { sentence: "I like to play football", translation: "Tôi thích chơi bóng đá" },
    "5": { sentence: "Today is a good day", translation: "Hôm nay là một ngày đẹp trời" },
  };

  useEffect(() => {
    const currentSentence = sentences[levelId];
    setSentence(currentSentence.sentence.split(" "));
    setShuffledWords(shuffleArray(currentSentence.sentence.split(" ")));

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          handleEndGame(); // Kết thúc trò chơi khi hết giờ
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [levelId]);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const handleSelectWord = (word) => {
    setSelectedWords([...selectedWords, word]);
    setShuffledWords(shuffledWords.filter((w) => w !== word));
  };

  const handleRemoveWord = (word) => {
    setShuffledWords([...shuffledWords, word]);
    setSelectedWords(selectedWords.filter((w) => w !== word));
  };

  const checkAnswer = () => {
    const joinedSentence = selectedWords.join(" ");
    if (joinedSentence === sentence.join(" ")) {
      setScore(timer > 30 ? 3 : timer > 0 ? 2 : 1);
      setModalMessage("🎉 Bạn đã hoàn thành đúng câu!");
    } else {
      setScore(0);
      setModalMessage("❌ Sai rồi! Hãy thử lại.");
    }
    setShowModal(true);
  };

  const handleEndGame = () => {
    setModalMessage("⏰ Thời gian đã hết! Hãy thử lại.");
    setShowModal(true);
  };

  const handleResetGame = () => {
    setSelectedWords([]);
    setShuffledWords([]);
    setModalMessage("");
    setShowModal(false);
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/anhnenchinh.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
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
          {sentences[levelId]?.translation || ""}
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

        {/* Modal thông báo */}
        <Modal transparent={true} visible={showModal} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleResetGame}
              >
                <Text style={styles.modalButtonText}>Thoát</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  timerIcon: {
    fontSize: 22,
    marginRight: 5,
    color: "#FFF",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  translationText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  wordBox: {
    backgroundColor: "#4FAAF5",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  wordText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  wordList: {
    paddingHorizontal: 10,
  },
  checkButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#4FAAF5",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});
