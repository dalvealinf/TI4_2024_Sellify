import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaginaPrincipal({ navigation }) {
  const funcionalidades = [
    { nombre: 'Escanear Productos', icono: 'barcode-scan', color: ['#007B83', '#00B2A9'] },
    { nombre: 'Revisar Inventario', icono: 'archive-outline', color: ['#005A9E', '#007BFF'] },
    { nombre: 'Editar Inventario', icono: 'pencil-outline', color: ['#563D7C', '#6F42C1']},
    { nombre: 'Historial de Ventas', icono: 'book-outline', color: ['#135123', '#066547'], screen: 'HistorialVentas' },
    { nombre: 'Agregar Productos', icono: 'plus-box-outline', color: ['#DAA520', '#FFD700'], screen: 'AddProduct' },
    { nombre: 'Gestionar Usuarios', icono: 'account-multiple-plus-outline', color: ['#6C757D', '#ADB5BD'] },
    { nombre: 'Estadísticas', icono: 'chart-pie', color: ['#28A745', '#8BC34A'], screen: 'DashBoard'  },
  ];

  const slideAnim = useRef(new Animated.Value(200)).current;

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestor de Inventario y Ventas</Text>
      </View>
      <Animated.View style={[styles.grid, { transform: [{ translateX: slideAnim }] }]}>
        {funcionalidades.map((func, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => {
              if (func.screen) {
                navigation.navigate(func.screen);
              }
            }}
          >
            <LinearGradient colors={func.color} style={styles.buttonGradient}>
              <Icon name={func.icono} size={28} color="#FFFFFF" />
              <Text style={styles.buttonText}>{func.nombre}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Animated.View>
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
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#34495E',
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 20,
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
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#34495E',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
