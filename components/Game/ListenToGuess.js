import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import Heading from "../RootLayout/Heading"; // Import Heading component
import { Audio } from "expo-av"; // Thư viện âm thanh từ expo-av

const screenWidth = Dimensions.get("window").width;

const Game = ({ navigation }) => {
  const [question] = useState({
    audio: require("../../assets/sound/sound_quest_3.mp3"),
    options: [
      { src: require("../../assets/images/img_game3_1.png"), text: "A Cat", correct: true },
      { src: require("../../assets/images/img_game3_2.png"), text: "The Pool", correct: true },
      { src: require("../../assets/images/img_game3_3r.png"), text: "The Kitchen", correct: false },
    ],
  });
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveAnimations, setWaveAnimations] = useState(
    Array(10)
      .fill(null)
      .map(() => new Animated.Value(0.5))
  );

  const startWaveAnimation = () => {
    waveAnimations.forEach((wave) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(wave, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(wave, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const stopWaveAnimation = () => {
    waveAnimations.forEach((wave) => wave.stopAnimation());
  };

  const playAudio = async () => {
    setIsPlaying(true);
    startWaveAnimation();

    const sound = new Audio.Sound();

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
      await sound.loadAsync(question.audio);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          stopWaveAnimation();
          sound.unloadAsync();
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error("Lỗi phát âm thanh:", error);
      setIsPlaying(false);
      stopWaveAnimation();
    }
  };

  const checkAnswer = () => {
    const correctIndexes = question.options
      .map((option, index) => (option.correct ? index : null))
      .filter((index) => index !== null);

    const isCorrect =
      correctIndexes.length === selectedOptions.length &&
      correctIndexes.every((index) => selectedOptions.includes(index));

    setResult(isCorrect);
    setShowModal(true);
  };

  const resetGame = () => {
    setSelectedOptions([]);
    setResult(null);
    setShowModal(false);
  };

  const handleSelect = (index) => {
    if (selectedOptions.includes(index)) {
      setSelectedOptions(selectedOptions.filter((i) => i !== index));
    } else {
      setSelectedOptions([...selectedOptions, index]);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/anhnenchinh.png")}
      style={styles.backgroundImage}
    >
      {/* Heading được thay thế */}
      <Heading title="Nghe và Chọn Đáp Án" onBackPress={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Ghi chú */}
        <Text style={styles.instructionText}>
          Hãy nghe đoạn ghi âm và chọn những đáp án đúng
        </Text>

        {/* Audio Player */}
        <TouchableOpacity style={styles.audioContainer} onPress={playAudio}>
          <Image
            source={require("../../assets/images/game3_1.png")}
            style={styles.audioImage}
          />
          {isPlaying ? (
            <View style={styles.waveBox}>
              {waveAnimations.map((wave, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.wave,
                    {
                      transform: [{ scaleY: wave }],
                    },
                  ]}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.audioText}>Bấm vào đây để nghe âm thanh bạn nhé!</Text>
          )}
        </TouchableOpacity>

        {/* Image Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionBox,
                selectedOptions.includes(index) && styles.selectedOptionBox,
              ]}
              onPress={() => handleSelect(index)}
            >
              <Image source={option.src} style={styles.image} />
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Check Answer Button */}
        <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
          <Text style={styles.checkButtonText}>Kiểm tra</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal transparent={true} visible={showModal} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {result ? "🎉 Đúng rồi!" : "❌ Sai mất rồi!"}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
                  <Text style={styles.modalButtonText}>Chơi lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.exitButton]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.modalButtonText}>Thoát ra</Text>
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
  instructionText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  audioImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  audioText: {
    fontSize: 16,
    color: "#FFF",
  },
  waveBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth / 2,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
  },
  wave: {
    width: 3,
    height: "100%",
    marginHorizontal: 3,
    backgroundColor: "#FFF",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  optionBox: {
    width: screenWidth / 3 - 10,
    height: screenWidth / 3 - 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOptionBox: {
    borderColor: "#4FAAF5",
  },
  image: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
  },
  optionText: {
    marginTop: 5,
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
  },
  checkButton: {
    backgroundColor: "#4FAAF5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  checkButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
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
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
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

export default Game;
