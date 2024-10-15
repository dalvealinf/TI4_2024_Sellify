<<<<<<< HEAD
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
=======
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

export default function InventoryScreen({ route }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigation = useNavigation();

  // Set search term if coming from searchBarcode
>>>>>>> dev
  useEffect(() => {
    if (route.params?.searchBarcode) {
      setSearchTerm(route.params.searchBarcode);
    }
  }, [route.params?.searchBarcode]);

<<<<<<< HEAD
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
=======
  // Fetch products on screen focus (when returning from edit page)
  useFocusEffect(
    useCallback(() => {
      fetchProducts(); // Fetch products whenever screen is focused
    }, [])
  );

  // Function to fetch products from the API
  const fetchProducts = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch('http://170.239.85.88:5000/products');
      const data = await response.json();

      const formattedProducts = data.map(product => {
        const fechaRegistroValida = product.fecha_registro ? new Date(product.fecha_registro) : null;
        const fechaVencimientoValida = product.fecha_vencimiento ? new Date(product.fecha_vencimiento) : null;

        return {
          ...product,
          fecha_registro: fechaRegistroValida && !isNaN(fechaRegistroValida)
            ? fechaRegistroValida.toISOString().split('T')[0]
            : 'Fecha inválida',
          fecha_vencimiento: fechaVencimientoValida && !isNaN(fechaVencimientoValida)
            ? fechaVencimientoValida.toISOString().split('T')[0]
            : 'Fecha inválida',
        };
      });

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo_barras.includes(searchTerm)
>>>>>>> dev
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

<<<<<<< HEAD
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
=======
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3BCEAC" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : filteredProducts.length > 0 ? (
        <ScrollView>
          {filteredProducts.map((product) => (
            <View key={product.id_producto} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.nombre}</Text>
                <Text style={styles.productDetails}>Precio: {product.precio_venta}</Text>

                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setExpandedProduct(expandedProduct === product.id_producto ? null : product.id_producto)}
                >
                  <Icon name={expandedProduct === product.id_producto ? "chevron-up" : "chevron-down"} size={20} color="white" />
                </TouchableOpacity>

                {expandedProduct === product.id_producto && (
                  <View style={styles.additionalInfo}>
                    <Text style={styles.additionalText}>Código: {product.codigo_barras}</Text>
                    <Text style={styles.additionalText}>Stock: {product.stock}</Text>
                    <Text style={styles.additionalText}>Descuento: {product.descuento}%</Text>
                    <Text style={styles.additionalText}>Categoría: {product.categoria}</Text>
                    <Text style={styles.additionalText}>Fecha de compra: {product.fecha_registro}</Text>
                    <Text style={styles.additionalText}>Fecha de vencimiento: {product.fecha_vencimiento}</Text>
                    <Text style={styles.additionalText}>Descripción: {product.descripcion}</Text>
                  </View>
                )}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('EditProduct', { product })}
                >
                  <Icon name="edit" size={20} color="black" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton}>
                  <Icon name="trash-2" size={20} color="black" />
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No existe ningún producto actualmente.</Text>
        </View>
      )}
>>>>>>> dev
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
<<<<<<< HEAD
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
=======
    position: 'relative',
>>>>>>> dev
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
<<<<<<< HEAD
=======
  additionalInfo: {
    marginTop: 12,
    backgroundColor: '#1E2A38',
    padding: 12,
    borderRadius: 8,
  },
  additionalText: {
    color: '#ccc',
    marginBottom: 4,
  },
  expandButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#1A73E8',
    padding: 8,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
>>>>>>> dev
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
<<<<<<< HEAD
=======
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#1A2238',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
>>>>>>> dev
});
