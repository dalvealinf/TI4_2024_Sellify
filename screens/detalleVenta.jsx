import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function DetalleVenta({ route }) {
  const { venta } = route.params; // Obtener datos de la venta desde los parámetros
  const [productos, setProductos] = useState([]); // Almacena los productos de la venta
  const [cajero, setCajero] = useState(null); // Almacena el nombre y apellido del cajero
  const [loading, setLoading] = useState(true); // Muestra el indicador de carga
  const navigation = useNavigation();

  // Función para obtener los detalles de la venta desde la API
  const fetchDetalleVenta = async (idVenta) => {
    try {
      const response = await fetch(`http://170.239.85.88:5000/detalleventa/${idVenta}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al obtener el detalle de la venta');
      }

      const data = await response.json();
      setProductos(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Ocurrió un error al obtener el detalle de la venta');
    }
  };

  // Función para obtener el nombre y apellido del cajero desde la API
  const fetchCajero = async (idCajero) => {
    try {
      const response = await fetch(`http://170.239.85.88:5000/users?id_usuario=${idCajero}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al obtener los datos del cajero');
      }

      const data = await response.json();
      if (data.length > 0) {
        setCajero({ nombre: data[0].nombre, apellido: data[0].apellido });
      } else {
        throw new Error('No se encontró información del cajero');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Ocurrió un error al obtener los datos del cajero');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDetalleVenta(venta.id);
      await fetchCajero(venta.cajero);
      setLoading(false);
    };
    loadData();
  }, [venta.id, venta.cajero]);

  // Función para renderizar cada producto
  const renderProducto = ({ item }) => (
    <View style={styles.productoContainer}>
      <Text style={styles.productoNombre}>{item.producto_nombre}</Text>
      <Text style={styles.productoCantidad}>Cantidad: {item.cantidad}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Detalles de la Venta</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3BCEAC" />
      ) : (
        <>
          <Text style={styles.detalle}>ID Venta: {venta.id}</Text>
          <Text style={styles.detalle}>
            Cajero: {cajero ? `${cajero.nombre} ${cajero.apellido}` : 'Desconocido'}
          </Text>
          <Text style={styles.detalle}>Total Recaudado: ${venta.total}</Text>

          <Text style={styles.subTitulo}>Productos Vendidos:</Text>

          <FlatList
            data={productos}
            renderItem={renderProducto}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2238',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginVertical: 10,
  },
  detalle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  productoContainer: {
    backgroundColor: '#2D3A59',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  productoNombre: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  productoCantidad: {
    fontSize: 14,
    color: '#BDC3C7',
  },
});
