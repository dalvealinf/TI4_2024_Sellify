import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens'; // Importar esta función
import MainScreen from './screens/LoginScreen';
import DashBoard from './screens/DashBoard';

enableScreens(); // Habilitar react-native-screens para mejorar el rendimiento

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={MainScreen} />
        <Stack.Screen name="Dashboard" component={DashBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
