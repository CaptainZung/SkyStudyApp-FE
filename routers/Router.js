import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/Screen/HomeScreen';
import LoginScreen from '../components/Login/LoginScreen';
import NameInputScreen from '../components/Login/NameInputScreen';
import CameraScreen from '../components/Camera/CameraScreen';
import GameScreen from '../components/Game/GameScreen';
import SettingScreen from '../components/Setting/SettingScreen';
import DetectionScreen from '../components/Camera/DetectionScreen';
import { UserProvider } from '../components/Screen/UserContext';
import EnglishByTopicScreen from '../components/EnP/EnglishByTopicScreen';
import YourDictScreen from '../components/Dictionary/YourDictScreen';
import VocabularyScreen from '../components/EnP/VocabularyScreen';
// import DefinitionScreen from '../components/EnP/DefinitionScreen';
import MatchWorldLevelScreen from '../components/Game/MatchWordLevelScreen';
import MatchWordScreen from '../components/Game/MatchWordScreen';
import SignUpScreen from '../components/Login/SignUpScreen';
import ExampleForVocabScreen from '../components/EnP/ExampleForVocabScreen';
import GuessTheWord from "../components/Game/GuessTheWord";
import ListenToGuess from "../components/Game/ListenToGuess"
import EnterPinScreen from '../components/Login/EnterPinScreen';
import PracticeSpeakingScreen from '../components/EnP/PracticeSpeakingScreen';
import ProfileScreen from '../components/Setting/ProfileScreen';
import PronunciationCheckScreen from '../components/Camera/PronunciationCheckScreen';
import BottomNav from '../components/Root/BottomNav';
import { AvatarProvider } from '../components/Root/AvatarContext';
import TrackingProcessingScreen from '../components/Tracking/TrackingProcessingScreen';
const Stack = createStackNavigator();

const Router = () => {
  return (
    <UserProvider> {/* Bọc UserContext */}
      <AvatarProvider> {/* Bọc AvatarContext */}
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="BottomNav" component={BottomNav} />
            <Stack.Screen name="NameInput" component={NameInputScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen name="Detection" component={DetectionScreen} />
            <Stack.Screen name="EnglishByTopic" component={EnglishByTopicScreen} />  
            <Stack.Screen name="Dictionary" component={YourDictScreen} />
            <Stack.Screen name="Vocabulary" component={VocabularyScreen}/>
            {/* <Stack.Screen name="Definition" component={DefinitionScreen}/> */}
            <Stack.Screen name="MatchWordLevel" component={MatchWorldLevelScreen}/>
            <Stack.Screen name="MatchWord" component={MatchWordScreen}/>
            <Stack.Screen name="SignUp" component={SignUpScreen}/>
            <Stack.Screen name="ExampleForVocab" component={ExampleForVocabScreen}></Stack.Screen>
            <Stack.Screen name="GuessTheWord" component={GuessTheWord}/>
            <Stack.Screen name="ListenToGuess" component={ListenToGuess}/>
            <Stack.Screen name="EnterPin" component={EnterPinScreen}></Stack.Screen>
            <Stack.Screen name="PracticeSpeaking" component={PracticeSpeakingScreen}></Stack.Screen>
            <Stack.Screen name="Profile" component={ProfileScreen}></Stack.Screen>
            <Stack.Screen name="PronunCheck" component={PronunciationCheckScreen}></Stack.Screen>
            <Stack.Screen name="Tracking" component={TrackingProcessingScreen}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AvatarProvider>
    </UserProvider>
  );
};


export default Router;
