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
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import * as Animatable from "react-native-animatable";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const images = [
  { src: require("../../assets/images/Dog.png"), word: "dog" },
  { src: require("../../assets/images/Banana.png"), word: "banana" },
  { src: require("../../assets/images/Apple.png"), word: "apple" },
];

const GuessTheWord = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [animationFeedback, setAnimationFeedback] = useState(""); // Loại phản hồi hiện tại (correct/wrong)
  const [gameOver, setGameOver] = useState(false);
  const navigation = useNavigation();

  const currentImage = images[currentIndex];
  const animationDuration = 2000; // Thời gian chạy của animation (2 giây)

  const playSound = async (type) => {
    const sound = new Audio.Sound();
    try {
      if (type === "correct") {
        await sound.loadAsync(require("../../assets/sound/correct.mp3"));
      } else {
        await sound.loadAsync(require("../../assets/sound/wrong.mp3"));
      }
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleCheckAnswer = () => {
    const isCorrect = input.toLowerCase() === currentImage.word.toLowerCase();

    playSound(isCorrect ? "correct" : "wrong");

    if (currentIndex + 1 === images.length) {
      // Nếu đây là lượt cuối cùng, hiển thị modal kết thúc trò chơi
      setAnimationFeedback(isCorrect ? "correct" : "wrong");
      setScore(isCorrect ? score + 1 : score);
      setGameOver(true); // Hiển thị modal kết thúc
      return;
    }

    // Nếu không phải lượt cuối, tiếp tục hiển thị modal phản hồi
    setAnimationFeedback(isCorrect ? "correct" : "wrong");
    setFeedback(isCorrect ? "Chính xác!" : "Sai rồi!");
    setShowFeedbackModal(true);

    setTimeout(() => {
      setShowFeedbackModal(false); // Đóng modal phản hồi sau khi animation chạy xong

      if (isCorrect) {
        setScore(score + 1);
        setCurrentIndex((prevIndex) => prevIndex + 1); // Tiếp tục sang hình tiếp theo
      }
      setInput(""); // Reset input sau mỗi lượt
      setFeedback(""); // Reset feedback
    }, animationDuration); // Đợi animation chạy hết
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setInput("");
    setFeedback("");
    setShowFeedbackModal(false);
    setGameOver(false);
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

        {/* Thanh tiến trình */}
        <Progress.Bar
          progress={(currentIndex + 1) / images.length}
          width={screenWidth * 0.8}
          color="#4FAAF5"
          style={{ marginBottom: 20 }}
        />

        {/* Điểm số */}
        <Text style={styles.score}>Điểm: {score}</Text>

        {/* Hình ảnh */}
        <Animatable.View animation="bounceIn" duration={1500} style={styles.imageContainer}>
          <Image source={currentImage.src} style={styles.image} />
        </Animatable.View>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Nhập câu trả lời của bạn"
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#AAA"
        />

        {/* Nút kiểm tra */}
        <Animatable.View animation="pulse" iterationCount="infinite">
          <TouchableOpacity style={styles.button} onPress={handleCheckAnswer}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Modal phản hồi */}
        <Modal transparent={true} visible={showFeedbackModal} animationType="fade">
          <View style={styles.modalFeedbackContainer}>
            <View style={styles.feedbackBox}>
              <LottieView
                source={
                  animationFeedback === "correct"
                    ? require("../../assets/animations/correct.json")
                    : require("../../assets/animations/wrong.json")
                }
                autoPlay
                loop={false}
                style={{ width: 150, height: 150 }}
              />
              <Text style={styles.feedbackText}>
                {animationFeedback === "correct" ? "Chính xác!" : "Sai rồi!"}
              </Text>
            </View>
          </View>
        </Modal>

        {/* Modal kết thúc trò chơi */}
        {gameOver && (
          <Modal transparent={true} visible={gameOver} animationType="fade">
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
        )}
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
    marginBottom: 10,
    color: "#FFF",
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: "rgba(79, 170, 245, 0.8)",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#4FAAF5",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.6,
    resizeMode: "cover",
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
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalFeedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  feedbackBox: {
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
  feedbackText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4FAAF5",
    marginTop: 10,
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
