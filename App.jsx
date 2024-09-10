<<<<<<< HEAD
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from './screens/LoginScreen';
import PaginaPrincipal from './screens/home';
import DashBoard from './screens/DashBoard';
import AddProduct from './screens/addForm';
import HistorialVentas from './screens/historialVenta';
import DetalleVenta from './screens/detalleVenta';
import BarcodeScannerPage from './screens/scan';
import UserManagement from './screens/GestionUsuarios';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false,}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={PaginaPrincipal} />
        <Stack.Screen name="DashBoard" component={DashBoard} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="HistorialVentas" component={HistorialVentas} />
        <Stack.Screen name="DetalleVenta" component={DetalleVenta} />
        <Stack.Screen name="BarcodeScannerPage" component={BarcodeScannerPage} />
        <Stack.Screen name="UserManagement" component={UserManagement} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
=======
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
>>>>>>> origin/E.-Contreras
