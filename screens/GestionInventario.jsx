import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InventoryScreen({ route }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [userType, setUserType] = useState(''); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://170.239.85.88:5000/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserType(data.tipo_usuario); 
      } catch (error) {
        console.error('Error al obtener el tipo de usuario:', error);
      }
    };

    fetchUserType();
  }, []);

  useEffect(() => {
    if (route.params?.searchBarcode) {
      setSearchTerm(route.params.searchBarcode);
    }
  }, [route.params?.searchBarcode]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts(); 
    }, [showInactive])
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://170.239.85.88:5000/products');
      const data = await response.json();

      const formattedProducts = data
        .filter(product => product.estado_producto === (showInactive ? 'inactivo' : 'activo'))
        .map(product => {
          const fechaRegistroValida = product.fecha_registro ? new Date(product.fecha_registro) : null;
          const fechaVencimientoValida = product.fecha_vencimiento ? new Date(product.fecha_vencimiento) : null;
          const fechaFinDescuentoValida = product.vencimiento_descuento ? new Date(product.vencimiento_descuento) : null;

          return {
            ...product,
            fecha_registro: fechaRegistroValida && !isNaN(fechaRegistroValida)
              ? fechaRegistroValida.toISOString().split('T')[0]
              : 'Fecha inválida',
            fecha_vencimiento: fechaVencimientoValida && !isNaN(fechaVencimientoValida)
              ? fechaVencimientoValida.toISOString().split('T')[0]
              : 'Fecha inválida',
            vencimiento_descuento: fechaFinDescuentoValida && !isNaN(fechaFinDescuentoValida)
              ? fechaFinDescuentoValida.toISOString().split('T')[0]
              : 'Sin descuento',
          };
        });

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deactivateProduct = async (codigo_barras) => {
    try {
      const response = await fetch(`http://170.239.85.88:5000/product/barcode/${codigo_barras}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok) {
        setModalMessage('Producto marcado como inactivo exitosamente.');
        setIsSuccess(true);
      } else {
        setModalMessage(result.msg || 'Error al desactivar el producto.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error al desactivar producto:', error);
      setModalMessage('No se pudo conectar con el servidor.');
      setIsSuccess(false);
    } finally {
      setModalVisible(true);
      fetchProducts();
    }
  };

  const confirmDeactivateProduct = (product) => {
    setSelectedProduct(product);
    setConfirmationModalVisible(true);
  };

  const handleConfirmDeactivate = () => {
    if (selectedProduct) {
      deactivateProduct(selectedProduct.codigo_barras);
      setConfirmationModalVisible(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const addAgainProduct = (product) => {
    navigation.navigate('AddProductAgain', { product });
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo_barras.includes(searchTerm)
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
  
        <Text style={styles.header}>Inventario</Text>
  
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowInactive(!showInactive)}
        >
          <Text style={styles.toggleButtonText}>
            {showInactive ? 'Mostrar Activos' : 'Mostrar Inactivos'}
          </Text>
        </TouchableOpacity>
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
                    <Text style={styles.additionalText}>Estado: {product.estado_producto}</Text>
                    <Text style={styles.additionalText}>Stock: {product.stock}</Text>
                    <Text style={styles.additionalText}>Descuento: {product.descuento}%</Text>
                    <Text style={styles.additionalText}>Fin del descuento: {product.vencimiento_descuento}</Text>
                    <Text style={styles.additionalText}>Categoría: {product.categoria}</Text>
                    <Text style={styles.additionalText}>Fecha de compra: {product.fecha_registro}</Text>
                    <Text style={styles.additionalText}>Fecha de vencimiento: {product.fecha_vencimiento}</Text>
                    <Text style={styles.additionalText}>Descripción: {product.descripcion}</Text>
                  </View>
                )}
              </View>
  
              {/* Action buttons for 'admin' only */}
              {userType === 'admin' && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditProduct', { product })}
                  >
                    <Icon name="edit" size={20} color="black" />
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
  
                  {!showInactive && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => confirmDeactivateProduct(product)}
                    >
                      <Icon name="trash-2" size={20} color="black" />
                      <Text style={styles.deleteButtonText}>Desactivar</Text>
                    </TouchableOpacity>
                  )}
  
                  <TouchableOpacity
                    style={styles.addAgainButton}
                    onPress={() => addAgainProduct(product)}
                  >
                    <Icon name="plus" size={20} color="black" />
                    <Text style={styles.addAgainButtonText}>Agregar de Nuevo</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No existe ningún producto actualmente.</Text>
        </View>
      )}
  
      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={closeConfirmationModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Icon name="alert-circle" size={60} color="#f44336" />
            <Text style={styles.modalTitle}>Confirmar Desactivación</Text>
            <Text style={styles.modalMessage}>¿Estás seguro que deseas desactivar este producto?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={handleConfirmDeactivate} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Desactivar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeConfirmationModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  
      {/* Success/Error Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Icon name={isSuccess ? 'check-circle' : 'alert-circle'} size={60} color={isSuccess ? '#4caf50' : '#f44336'} />
            <Text style={styles.modalTitle}>{isSuccess ? 'Éxito' : 'Error'}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.finishButton}>
              <Text style={styles.finishButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    marginBottom: 20,
  },
  backButton: {
    marginLeft: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    flex: 1, 
    marginLeft: 1,
  },
  toggleButton: {
    backgroundColor: '#1A73E8', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    position: 'relative',
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
    marginTop: 15,
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#3BCEAC',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#1A2238',
    marginLeft: 3,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#1A2238',
    marginLeft: 3,
  },
  addAgainButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addAgainButtonText: {
    color: '#1A2238',
    marginLeft: 3,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f1c40f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});