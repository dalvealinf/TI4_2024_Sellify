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
import AddUser from './screens/addUsuario';
import InventoryScreen from './screens/GestionInventario';
import EditProduct from './screens/EditProduct';
import ProfileScreen from './screens/Profile';
import EditUser from './screens/EditUser';
import AddProductAgain from './screens/addProductAgain';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import InactiveUsers from './screens/InactiveUsers';

// Create the stack navigator
const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response Received:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={PaginaPrincipal} />
          <Stack.Screen name="DashBoard" component={DashBoard} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
          <Stack.Screen name="HistorialVentas" component={HistorialVentas} />
          <Stack.Screen name="DetalleVenta" component={DetalleVenta} />
          <Stack.Screen name="BarcodeScannerPage" component={BarcodeScannerPage} />
          <Stack.Screen name="UserManagement" component={UserManagement} />
          <Stack.Screen name="AddUser" component={AddUser} />
          <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
          <Stack.Screen name="EditProduct" component={EditProduct} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="EditUser" component={EditUser} />
          <Stack.Screen name="AddProductAgain" component={AddProductAgain} />
          <Stack.Screen name="InactiveUsers" component={InactiveUsers} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// Register for push notifications and setup local notifications
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get notification permissions!');
    return;
  }

  // No need to get token for local notifications
  console.log('Notification permissions granted.');
}

// Function to schedule a local notification for a product's expiration date
export async function scheduleNotification(title, body, triggerDate) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      date: triggerDate,
    },
  });
}
