import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/Screen/HomeScreen';
import LoginScreen from '../components/Screen/LoginScreen';
import NameInputScreen from '../components/Screen/NameInputScreen';
import CameraScreen from '../components/Screen/CameraScreen';
import GameScreen from '../components/Screen/GameScreen';
import SettingScreen from '../components/Screen/SettingScreen';
import SendOTP from '../components/Screen/SendOTPScreen';
import DetectionScreen from '../components/Screen/DetectionScreen';
import { UserContext } from '../components/Screen/UserContext';
import EnglishByTopicScreen from '../components/Screen/EnglishByTopicScreen';
import YourDictScreen from '../components/Screen/YourDictScreen';
import VocabularyScreen from '../components/Screen/VocabularyScreen';
import DefinitionScreen from '../components/Screen/DefinitionScreen';
import GamePlayScreen from '../components/Game/GamePlayScreen';
import LevelScreen from '../components/Game/LevelScreen';
import SignUpScreen from '../components/Screen/SignUpScreen';

// import VerifyOTP from '../components/VerifyOTPScreen';
// import Detection from '../components/DetectionScreen';

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
        <Stack.Screen name="GamePlay" component={GamePlayScreen}/>
        <Stack.Screen name="Level" component={LevelScreen}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
