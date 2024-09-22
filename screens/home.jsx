import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';

export default function PaginaPrincipal({ navigation }) {
  const funcionalidades = [
    { nombre: 'Escanear Productos', icono: 'barcode-scan', screen: 'BarcodeScannerPage' },
    { nombre: 'Revisar Inventario', icono: 'archive-outline', screen: 'InventoryScreen' },
    { nombre: 'Historial de Ventas', icono: 'book-outline', screen: 'HistorialVentas' },
    { nombre: 'Agregar Productos', icono: 'plus-box-outline', screen: 'AddProduct' },
    { nombre: 'Gestionar Usuarios', icono: 'account-multiple-plus-outline', screen: 'UserManagement' },
    { nombre: 'Estadísticas', icono: 'chart-pie', screen: 'DashBoard'  },
  ];

  const slideAnim = useRef(new Animated.Value(200)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/SellifyLOGO.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Carrusel y las funcionalidades juntas para el scroll */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.carouselContainer}>
          <Swiper 
            style={styles.wrapper} 
            showsButtons={true} 
            autoplay={true} 
            removeClippedSubviews={false} 
            height={150}
          >
            <View style={styles.slide}>
              <Text style={styles.text}>Texto de ejemplo 1</Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.text}>Texto de ejemplo 2</Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.text}>Texto de ejemplo 3</Text>
            </View>
          </Swiper>
        </View>

        {/* Botones con las funcionalidades */}
        <Animated.View style={[styles.grid, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.row}>
            <View style={styles.column}>
              {funcionalidades.slice(0, 4).map((func, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.button}
                  onPress={() => {
                    if (func.screen) {
                      navigation.navigate(func.screen);
                    }
                  }}
                >
                  <LinearGradient colors={['#3BCEAC', '#3BCEAC']} style={styles.buttonGradient}>
                    <Icon name={func.icono} size={28} color="#1A2238" />
                    <Text style={styles.buttonText}>{func.nombre}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.column}>
              {funcionalidades.slice(4).map((func, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.button}
                  onPress={() => {
                    if (func.screen) {
                      navigation.navigate(func.screen);
                    }
                  }}
                >
                  <LinearGradient colors={['#3BCEAC', '#3BCEAC']} style={styles.buttonGradient}>
                    <Icon name={func.icono} size={28} color="#1A2238" />
                    <Text style={styles.buttonText}>{func.nombre}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton}>
        <Icon name="logout" size={24} color="#FFFFFF" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2238',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 40,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 80,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  button: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2238',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#2D3A59',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Estilos del carrusel
  carouselContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 10,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D3A59',
    height: 150,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
