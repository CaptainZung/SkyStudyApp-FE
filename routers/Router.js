import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import LoginScreen from '../components/LoginScreen';
import NameInputScreen from '../components/NameInputScreen';
import CameraScreen from '../components/CameraScreen';
import GameScreen from '../components/GameScreen';
import SettingScreen from '../components/SettingScreen';
import SendOTP from '../components/SendOTPScreen';
import Detection from '../components/Detection';
import { UserContext } from '../components/UserContext';
import EnglishByTopicScreen from '../components/EnglishByTopicScreen';
import YourDictScreen from '../components/YourDictScreen';
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
        <Stack.Screen name="Detection" component={Detection} />
        <Stack.Screen name="User" component={UserContext} />    
        <Stack.Screen name="EnglishByTopic" component={EnglishByTopicScreen} />  
        <Stack.Screen name="Dictionary" component={YourDictScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
