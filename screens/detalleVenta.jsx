import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function DetalleVenta({ route }) {
  const { venta } = route.params;
  const navigation = useNavigation();

  const renderProducto = ({ item }) => (
    <View style={styles.productoContainer}>
      <Text style={styles.productoNombre}>{item.nombre}</Text>
      <Text style={styles.productoPrecio}>{item.precio}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Detalles de la Venta</Text>
      </View>

      <Text style={styles.detalle}>Cajero: {venta.cajero}</Text>
      <Text style={styles.detalle}>Total Recaudado: {venta.total}</Text>

      <Text style={styles.subTitulo}>Productos Vendidos:</Text>
      <FlatList
        data={venta.productos}
        renderItem={renderProducto}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centers the title
    paddingVertical: 15,
    backgroundColor: '#34495E', // Light background
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  backButton: {
    position: 'absolute',
    left: 15, // Move the back arrow to the left
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
    backgroundColor: '#34495E',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  productoNombre: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  productoPrecio: {
    fontSize: 14,
    color: '#BDC3C7',
  },
});
