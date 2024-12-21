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
    const cleanedSentence = currentSentence.sentence.trim().split(" ");
    setSentence(cleanedSentence);
    setShuffledWords(shuffleArray(cleanedSentence));

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          handleEndGame();
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [levelId]);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const handleSelectWord = (word) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
      setShuffledWords((prev) => prev.filter((w) => w !== word));
    }
  };

  const handleRemoveWord = (word) => {
    setShuffledWords((prev) => [...prev, word]);
    setSelectedWords((prev) => prev.filter((w) => w !== word));
  };

  const checkAnswer = () => {
    const joinedSentence = selectedWords.join(" ").trim(); // Kết hợp và loại bỏ khoảng trắng dư
    const correctSentence = sentence.join(" ").trim(); // Kết hợp và loại bỏ khoảng trắng dư

    if (joinedSentence === correctSentence) {
      setModalMessage("🎉 Bạn đã hoàn thành đúng câu!");
    } else {
      setModalMessage("❌ Sai rồi! Hãy thử lại.");
    }
    setShowModal(true);
  };

  const handleEndGame = () => {
    setModalMessage("⏰ Thời gian đã hết! Hãy thử lại.");
    setShowModal(true);
  };

  const handleRetry = () => {
    setSelectedWords([]);
    setShuffledWords(shuffleArray(sentence));
    setTimer(60);
    setShowModal(false);
  };

  const handleExit = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/anhnenchinh.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nối Từ</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerIcon}>⏰</Text>
          <Text style={styles.timerText}>{timer} Giây</Text>
        </View>

        <Text style={styles.translationText}>
          {sentences[levelId]?.translation || ""}
        </Text>

        <View style={styles.selectedContainer}>
          {sentence.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={styles.placeholderBox}
              onPress={() =>
                selectedWords[index] && handleRemoveWord(selectedWords[index])
              }
              disabled={!selectedWords[index]}
            >
              <Text style={styles.placeholderText}>
                {selectedWords[index] || "___"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.wordOptionsWrapper}>
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

          <TouchableOpacity
            style={styles.checkButtonInside}
            onPress={checkAnswer}
            disabled={timer <= 0}
          >
            <Text style={styles.checkButtonText}>Kiểm Tra</Text>
          </TouchableOpacity>
        </View>

        <Modal transparent={true} visible={showModal} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.retryButton]}
                  onPress={handleRetry}
                >
                  <Text style={styles.modalButtonText}>Thử lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.exitButton]}
                  onPress={handleExit}
                >
                  <Text style={styles.modalButtonText}>Thoát</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: "flex-start",
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
  placeholderBox: {
    borderWidth: 2,
    borderColor: "#4FAAF5",
    borderRadius: 5,
    padding: 10,
    margin: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 15,
    color: "#FFF",
  },
  wordOptionsWrapper: {
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 20,
    marginBottom: 20,
    alignSelf: "stretch",
    zIndex: 1,
    alignItems: "center",
  },
  wordBox: {
    backgroundColor: "#FFF",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  wordText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  wordList: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  checkButtonInside: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
    zIndex: 1,
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  modalButton: {
    backgroundColor: "#4FAAF5",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  retryButton: {
    marginRight: 10,
  },
  exitButton: {
    backgroundColor: "#FF6347",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});
