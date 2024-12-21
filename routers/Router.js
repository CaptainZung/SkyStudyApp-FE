import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/Screen/HomeScreen';
import LoginScreen from '../components/Screen/LoginScreen';
import NameInputScreen from '../components/Screen/NameInputScreen';
import CameraScreen from '../components/Screen/CameraScreen';
import GameScreen from '../components/Screen/GameScreen';
import SettingScreen from '../components/Screen/SettingScreen';
import DetectionScreen from '../components/Screen/DetectionScreen';
import { UserContext } from '../components/Screen/UserContext';
import EnglishByTopicScreen from '../components/Screen/EnglishByTopicScreen';
import YourDictScreen from '../components/Screen/YourDictScreen';
import VocabularyScreen from '../components/Screen/VocabularyScreen';
import DefinitionScreen from '../components/Screen/DefinitionScreen';
import MatchWorldLevelScreen from '../components/Game/MatchWordLevelScreen';
import MatchWordScreen from '../components/Game/MatchWorldScreen';
import SignUpScreen from '../components/Screen/SignUpScreen';

import ExampleForVocabScreen from '../components/Screen/ExampleForVocabScreen';
// import DetectionScreen from '../components/DetectionScreen';
import GuessTheWord from "../components/Game/GuessTheWord";
import ListenToGuess from "../components/Game/ListenToGuess"
import EnterPinScreen from '../components/Screen/EnterPinScreen';
import PracticeSpeakingScreen from '../components/Screen/PracticeSpeakingScreen';
import ProfileScreen from '../components/Screen/ProfileScreen';
import PronunciationCheckScreen from '../components/Screen/PronunciationCheckScreen';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />
        {/* <Stack.Screen name="Verify" component={VerifyOTPScreen} />
        <Stack.Screen name="SendOTP" component={SendOTPScreen} /> */}
        <Stack.Screen name="Detection" component={DetectionScreen} />
        <Stack.Screen name="User" component={UserContext} />    
        <Stack.Screen name="EnglishByTopic" component={EnglishByTopicScreen} />  
        <Stack.Screen name="Dictionary" component={YourDictScreen} />
        <Stack.Screen name="Vocabulary" component={VocabularyScreen}/>
        <Stack.Screen name="Definition" component={DefinitionScreen}/>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
