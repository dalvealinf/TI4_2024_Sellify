import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const products = [
  {
    id: 1,
    name: 'Leche',
    categoria: 'Lácteos',
    precio: '2500',
    stock: '50',
    descuento: '10',
    fechaCompra: '2024-09-15',
    fechaVencimiento: '2025-09-15',
    barcode: '1234567890123',
    description: 'Leche.',
  },
  {
    id: 2,
    name: 'Carne de Res',
    categoria: 'Carnes',
    precio: '5500',
    stock: '20',
    descuento: '5',
    fechaCompra: '2024-08-10',
    fechaVencimiento: '2024-12-10',
    barcode: '1234567890456',
    description: 'Carne.',
  },
  {
    id: 3,
    name: 'Coca-Cola',
    categoria: 'Bebidas',
    precio: '2000',
    stock: '100',
    descuento: '0',
    fechaCompra: '2024-09-15',
    fechaVencimiento: '2025-09-15',
    barcode: '7806500172116',
    description: 'Bebida gaseosa.',
  },
];

export default function InventoryScreen({route}) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    if (route.params?.searchBarcode) {
      setSearchTerm(route.params.searchBarcode);
    }
  }, [route.params?.searchBarcode]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Inventario</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Buscar por nombre o código de barras..."
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>
      </View>

      <ScrollView>
        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDetails}>Código: {product.barcode}</Text>
              <Text style={styles.productDetails}>precio: {product.precio}</Text>
              <Text style={styles.productDetails}>Stock: {product.stock}</Text>
              <Text style={styles.productDetails}>Descuento: {product.descuento}%</Text>
              <Text style={styles.productDetails}>Categoría: {product.categoria}</Text>
              <Text style={styles.productDetails}>Fecha de compra: {product.fechaCompra}</Text>
              <Text style={styles.productDetails}>Fecha de vencimiento: {product.fechaVencimiento}</Text>
              <Text style={styles.productDetails}>Descripción: {product.description}</Text>

            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProduct', { product: product })}
            >
              <Icon name="edit" size={20} color="black" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1A2238',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  backButton: {
    marginLeft: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  searchContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3A59',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 10,
  },
  productCard: {
    backgroundColor: '#2D3A59',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetails: {
    color: '#aaa',
  },
  editButton: {
    backgroundColor: '#3BCEAC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#1A2238',
    marginLeft: 8,
  },
});
