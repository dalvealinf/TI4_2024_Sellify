import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import PaginaPrincipal from './screens/home';
import DashBoard from './screens/DashBoard';
import AddProduct from './screens/addForm';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={PaginaPrincipal} />
        <Stack.Screen name="DashBoard" component={DashBoard} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}