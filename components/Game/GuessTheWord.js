import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const images = [
  { src: require("../../assets/images/Dog.jpg"), word: "dog" },
  { src: require("../../assets/images/Banana.png"), word: "banana" },
  { src: require("../../assets/images/Apple.jpg"), word: "apple" },
];

const GuessTheWord = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  const currentImage = images[currentIndex];

  const handleCheckAnswer = () => {
    if (input.toLowerCase() === currentImage.word.toLowerCase()) {
      setFeedback("Chính xác!");
      setScore(score + 1);
      setTimeout(() => {
        setFeedback("");
        setInput("");

        if (currentIndex + 1 === images.length) {
          setShowModal(true); // Hiển thị kết quả khi hoàn thành
        } else {
          setCurrentIndex((prevIndex) => prevIndex + 1); // Chuyển sang hình tiếp theo
        }
      }, 1000);
    } else {
      setFeedback("Sai rồi, thử lại nhé!");
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setInput("");
    setFeedback("");
    setShowModal(false);
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
          <Text style={styles.title}>Đoán Từ</Text>
        </View>

        {/* Điểm số */}
        <Text style={styles.score}>Điểm: {score}</Text>

        {/* Ảnh với viền sát */}
        <View style={styles.imageContainer}>
          <Image source={currentImage.src} style={styles.image} />
        </View>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Nhập câu trả lời của bạn"
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#AAA"
        />

        {/* Nút kiểm tra */}
        <TouchableOpacity style={styles.button} onPress={handleCheckAnswer}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>

        {/* Phản hồi */}
        <Text
          style={[
            styles.feedback,
            feedback === "Chính xác!" ? styles.correct : styles.wrong,
          ]}
        >
          {feedback}
        </Text>

        {/* Modal hiển thị kết quả */}
        <Modal transparent={true} visible={showModal} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>🎉 Hoàn thành trò chơi!</Text>
              <Text style={styles.modalText}>
                Điểm của bạn: {score} / {images.length}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
                  <Text style={styles.modalButtonText}>Chơi lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.exitButton]}
                  onPress={() => navigation.goBack()}
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
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
  score: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    color: "#FFF",
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: "#4FAAF5",
    borderRadius: 10,
    overflow: "hidden", // Bắt buộc để viền ôm sát hình
    marginBottom: 20,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.6,
    resizeMode: "cover", // Đảm bảo hình ảnh lấp đầy container
  },
  input: {
    width: "90%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  button: {
    backgroundColor: "#4FAAF5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedback: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  correct: {
    color: "green",
  },
  wrong: {
    color: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#4FAAF5",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  exitButton: {
    backgroundColor: "#FF6347",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default GuessTheWord;
