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
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}