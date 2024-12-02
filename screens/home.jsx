import React, { useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAndNotifyProducts } from '../services/NotificationService';
import * as Notifications from 'expo-notifications';


export default function PaginaPrincipal({ navigation }) {
  const [userType, setUserType] = useState('');
  const [topByPoints, setTopByPoints] = useState([]);
  const [topBySales, setTopBySales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [bestSale, setBestSale] = useState(null);
  const [bestSeller, setBestSeller] = useState(null);

  const funcionalidadesAdmin = [
    { nombre: 'Escanear Productos', icono: 'barcode-scan', screen: 'BarcodeScannerPage' },
    { nombre: 'Revisar Inventario', icono: 'archive-outline', screen: 'InventoryScreen' },
    { nombre: 'Historial de Ventas', icono: 'book-outline', screen: 'HistorialVentas' },
    { nombre: 'Agregar Productos', icono: 'plus-box-outline', screen: 'AddProduct' },
    { nombre: 'Gestionar Usuarios', icono: 'account-multiple-plus-outline', screen: 'UserManagement' },
    { nombre: 'Estadísticas', icono: 'chart-pie', screen: 'DashBoard'  },
    { nombre: 'Perfil', icono: 'account-circle', screen: 'ProfileScreen' },
    {
      nombre: 'Test Notificaciones',
      icono: 'bell-ring',
      screen: null,
      onPress: async () => {
        try {
          // Simple test notification first
          
          
          // Then try the full product notifications
          const response = await fetch('http://170.239.85.88:5000/products');
          const products = await response.json();
          await checkAndNotifyProducts(products, 'manual-test');
        } catch (error) {
          console.error('Error testing notifications:', error);
          Alert.alert('Error', 'No se pudieron enviar las notificaciones: ' + error.message);
        }
      }
    }
  ];

  const funcionalidadesCajero = [
    { nombre: 'Escanear Productos', icono: 'barcode-scan', screen: 'BarcodeScannerPage' },
    { nombre: 'Revisar Inventario', icono: 'archive-outline', screen: 'InventoryScreen' },
    { nombre: 'Perfil', icono: 'account-circle', screen: 'ProfileScreen' },
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

  useEffect(() => {
    const obtenerTipoUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://170.239.85.88:5000/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserType(data.tipo_usuario);
      } catch (error) {
        console.error('Error al obtener el tipo de usuario:', error);
      }
    };

    obtenerTipoUsuario();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {

          const pointsResponse = await fetch('http://170.239.85.88:5000/top-users-by-points');
          const pointsData = await pointsResponse.json();
          setTopByPoints(pointsData.slice(0, 3));
  
          const salesResponse = await fetch('http://170.239.85.88:5000/top-users-by-sales');
          const salesData = await salesResponse.json();
          setTopBySales(salesData.slice(0, 3));
  
          // New fetch calls for products
          const productsResponse = await fetch('http://170.239.85.88:5000/products');
          const products = await productsResponse.json();
          
          const bestSaleResponse = await fetch('http://170.239.85.88:5000/best-sale-of-week');
          const bestSaleData = await bestSaleResponse.json();
          setBestSale(bestSaleData);

          const bestSellerResponse = await fetch('http://170.239.85.88:5000/best-seller-of-month');
          const bestSellerData = await bestSellerResponse.json();
          setBestSeller(bestSellerData);
          
          // Filter low stock products (stock < 10)
          const lowStock = products
            .filter(product => product.stock <= 20)
            .sort((a, b) => a.stock - b.stock);
          setLowStockProducts(lowStock);
  
          // Filter products expiring in next 30 days
          const today = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
  
          const expiring = products
            .filter(product => {
              const expiryDate = new Date(product.fecha_vencimiento);
              return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
            })
            .sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));
          setExpiringProducts(expiring);
  
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [])
  );
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Alert.alert("Cerrar sesión", "Se ha cerrado la sesión con éxito.", [
        { text: "OK", onPress: () => navigation.replace('Login') }
      ]);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const funcionalidades = userType === 'admin' ? funcionalidadesAdmin : funcionalidadesCajero;

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

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.carouselContainer}>
          <Swiper 
            style={styles.wrapper} 
            showsButtons={true} 
            autoplay={true} 
            removeClippedSubviews={false} 
            height={200}
          >
            <View style={styles.slide}>
              <Text style={styles.slideTitle}>¡Bienvenido a Sellify!</Text>
              <View style={styles.slideContent}>
              <Text style={styles.slideText}>Sistema de gestión de inventario</Text>
              </View>
            </View>

            <View style={styles.slide}>
            <Text style={styles.slideTitle}>Top 3 Clientes por Puntos</Text>
            <View style={styles.slideContent}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#3BCEAC" />
              ) : error ? (
                <Text style={styles.errorText}>Error al cargar datos</Text>
              ) : topByPoints.length === 0 ? (
                <Text style={styles.slideText}>No hay clientes con puntos aún</Text>
              ) : (
                topByPoints.map((user, index) => (
                  <Text key={index} style={styles.slideText}>
                    {`${index + 1}. ${user.nombre_completo}: ${user.puntos} pts`}
                  </Text>
                ))
              )}
            </View>
          </View>
            
          <View style={styles.slide}>
            <Text style={styles.slideTitle}>Top 3 Compradores</Text>
            <View style={styles.slideContent}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#3BCEAC" />
              ) : error ? (
                <Text style={styles.errorText}>Error al cargar datos</Text>
              ) : topBySales.length === 0 ? (
                <Text style={styles.slideText}>No hay compradores registrados aún</Text>
              ) : (
                topBySales.map((user, index) => (
                  <Text key={index} style={styles.slideText}>
                    {`${index + 1}. ${user.nombre_completo}: ${user.total_ventas} compras`}
                  </Text>
                ))
              )}
            </View>
          </View>
          {bestSale && (
            <View style={styles.slide}>
              <Text style={styles.slideTitle}>Mejor Venta de la Semana</Text>
              <View style={styles.slideContent}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#3BCEAC" />
                ) : (
                  <>
                    <Text style={styles.slideText}>
                      Vendedor: {bestSale.vendedor}
                    </Text>
                    <Text style={styles.slideText}>
                      Monto: ${bestSale.monto}
                    </Text>
                    <Text style={styles.slideText}>
                      Fecha: {new Date(bestSale.fecha_venta).toLocaleDateString()}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          {bestSeller && (
            <View style={styles.slide}>
              <Text style={styles.slideTitle}>Mejor Vendedor del Mes</Text>
              <View style={styles.slideContent}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#3BCEAC" />
                ) : (
                  <>
                    <Text style={styles.slideText}>
                      Vendedor: {bestSeller.vendedor}
                    </Text>
                    <Text style={styles.slideText}>
                      Total Ventas: ${bestSeller.total_ventas}
                    </Text>
                    <Text style={styles.slideText}>
                      Número de Ventas: {bestSeller.numero_ventas}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}
          {lowStockProducts.length > 0 && (
            <View style={styles.slide}>
              <Text style={styles.slideTitle}>Productos con Bajo Stock</Text>
              <View style={styles.slideContent}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#3BCEAC" />
                ) : (
                  <>
                    {lowStockProducts.slice(0, 3).map((product, index) => (
                      <Text key={index} style={styles.slideText}>
                        {`${product.nombre}: ${product.stock} unidades`}
                      </Text>
                    ))}
                    {lowStockProducts.length > 3 && (
                      <Text style={styles.warningText}>
                        {`Y ${lowStockProducts.length - 3} producto/s más con bajo stock`}
                      </Text>
                    )}
                  </>
                )}
              </View>
            </View>
          )}
          
{expiringProducts.length > 0 && (
  <View style={styles.slide}>
    <Text style={styles.slideTitle}>Productos por Vencer</Text>
    <View style={styles.slideContent}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#3BCEAC" />
      ) : (
        <>
          {expiringProducts.slice(0, 3).map((product, index) => (
            <Text key={index} style={styles.slideText}>
              {`${product.nombre}: ${new Date(product.fecha_vencimiento).toLocaleDateString()}`}
            </Text>
          ))}
          {expiringProducts.length > 3 && (
            <Text style={styles.warningText}>
              {`Y ${expiringProducts.length - 3} producto/s más por vencer`}
            </Text>
          )}
        </>
      )}
    </View>
  </View>
)}
          </Swiper>
        </View>

        <Animated.View style={[styles.grid, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.row}>
            <View style={styles.column}>
              {funcionalidades.slice(0, 4).map((func, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.button]}
                  onPress={() => {
                    
                    if (func.onPress) {
                      func.onPress();
                    } else if (func.screen) {
                      navigation.navigate(func.screen);
                    }
                  }}
                >
                  <LinearGradient 
                  colors={['#3BCEAC', '#3BCEAC']} style={styles.buttonGradient}
                  >
                    <Icon name={func.icono} size={28} color="#1A2238" />
                    <Text style={styles.buttonText}>{func.nombre}
                    </Text>
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
                    if (func.onPress) {
                      func.onPress();
                    } else if (func.screen) {
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    marginBottom: 0,
  },
  scrollContent: {
    paddingBottom: 0,
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
    backgroundColor: '#2D3A59',
    padding: 15,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  slideTitle: {
    color: '#3BCEAC',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: 20,
    width: '110%'
  },
  
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 3,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  warningText: {
    color: '#FFB347',
    fontSize: 16,
    textAlign: 'center',
  },
});
