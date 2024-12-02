import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProduct({ route, navigation }) {
  const { product } = route.params;

  const validateDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date : new Date();
  };

  const [nombre, setNombre] = useState((product.nombre) || '');
  const [categoria, setCategoria] = useState((product.categoria) || 'Lacteos');
  const [precio, setPrecio] = useState((product.precio_venta) || '');
  const [stock, setStock] = useState(product.stock ? String(product.stock) : '');
  const [descuento, setDescuento] = useState((product.descuento) || '0');
  const [fechaCompra, setFechaCompra] = useState(validateDate(product.fecha_registro));
  const [fechaVencimiento, setFechaVencimiento] = useState(validateDate(product.fecha_vencimiento));
  const [fechaFinDescuento, setFechaFinDescuento] = useState(new Date());
  const [barcode, setBarcode] = useState((product.codigo_barras) || '');
  const [description, setDescription] = useState((product.descripcion) || '');


  const [isActive, setIsActive] = useState(product.estado_producto === 'activo');

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customCategory, setCustomCategory] = useState(categoria);

  const [showFechaCompraPicker, setShowFechaCompraPicker] = useState(false);
  const [showFechaVencimientoPicker, setShowFechaVencimientoPicker] = useState(false);
  const [showFechaFinDescuentoPicker, setShowFechaFinDescuentoPicker] = useState(false); 

  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dropdownFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('http://170.239.85.88:5000/categories');
        const result = await response.json();
        setCategories(result);
        setFilteredCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('No se pudo obtener las categorías.');
        setErrorModalVisible(true);
      }
    }

    fetchCategories();

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (dropdownVisible) {
        toggleDropdown(); // Close dropdown on keyboard dismiss
      }
      if (!categoria) {
        setCategoria(customCategory || 'Escribe la categoría');
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [dropdownVisible, categoria, customCategory]);

  useEffect(() => {
    if (parseFloat(descuento) > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1, 
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [descuento]);

  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(dropdownFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = categories.filter(category =>
      category.nombre_categoria.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleFieldPress = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
      if (!categoria) {
        setCategoria(customCategory || 'Escribe la categoría');
      }
    }
  };

  const handleEditProduct = async () => {
    const updatedProduct = {
      nombre: nombre,
      descripcion: description,
      fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
      stock: parseInt(stock),
      descuento: descuento ? parseFloat(descuento) : 0,
      precio_venta: parseFloat(precio),
      estado: isActive ? 'activo' : 'inactivo', // Estado based on the toggle
      categoria,
    };

    if (parseFloat(descuento) > 0) {
      updatedProduct.vencimiento_descuento = fechaFinDescuento.toISOString().split('T')[0]; // Discount expiration date
    }

    try {
      const response = await fetch(`http://170.239.85.88:5000/product/barcode/${barcode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      const result = await response.json();

      if (response.ok) {
        setModalVisible(true); // Show success modal
      } else {
        setErrorMessage(result.msg || 'Hubo un error al editar el producto');
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error editing product:', error);
      setErrorMessage('No se pudo conectar con el servidor.');
      setErrorModalVisible(true);
    }
  };

  const closeEditModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={handleFieldPress}>
      <ScrollView contentContainerStyle={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeEditModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Icon name="check-circle" size={60} color="#4caf50" />
              <Text style={styles.modalTitle}>¡Producto Editado!</Text>
              <TouchableOpacity onPress={closeEditModal} style={styles.finishButton}>
                <Text style={styles.finishButtonText}>Regresar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={errorModalVisible}
          onRequestClose={() => setErrorModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Icon name="alert-circle" size={60} color="#FF6B6B" />
              <Text style={styles.modalTitle}>Error</Text>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setErrorModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Editar Producto</Text>
        </View>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del producto"
          placeholderTextColor={'#ABB2B9'}
        />

        <Text style={styles.label}>Categoría</Text>
        <TouchableOpacity style={styles.input} onPress={toggleDropdown}>
          <Text style={styles.dropdownText}>{categoria || 'Escribe la categoría'}</Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <Animated.View style={[styles.dropdownContainer, { opacity: dropdownFadeAnim }]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar categoría"
              value={searchQuery}
              onChangeText={(query) => {
                setCustomCategory(query);
                handleSearch(query);
              }}
              onSubmitEditing={() => {
                setCategoria(customCategory || 'Escribe la categoría');
                toggleDropdown();
              }}
            />
            <ScrollView style={styles.scrollableDropdown} nestedScrollEnabled={true}>
              {filteredCategories.map((item) => (
                <TouchableOpacity
                  key={item.id_categoria}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCategoria(item.nombre_categoria);
                    toggleDropdown();
                  }}
                >
                  <Text style={styles.dropdownText}>{item.nombre_categoria}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <Text style={styles.label}>Estado del Producto</Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isActive ? styles.activeButton : styles.inactiveButton]}
            onPress={() => setIsActive(true)}
          >
            <Text style={[styles.toggleText, isActive ? styles.activeText : styles.inactiveText]}>Activo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, !isActive ? styles.activeButton : styles.inactiveButton]}
            onPress={() => setIsActive(false)}
          >
            <Text style={[styles.toggleText, !isActive ? styles.activeText : styles.inactiveText]}>Inactivo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción del producto"
          placeholderTextColor="#ABB2B9"
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          value={precio}
          onChangeText={setPrecio}
          placeholder="Precio"
          placeholderTextColor="#ABB2B9"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Stock</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="Cantidad en stock"
          placeholderTextColor="#ABB2B9"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Descuento (opcional)</Text>
        <TextInput
          style={styles.input}
          value={descuento}
          onChangeText={setDescuento}
          placeholder="Descuento (%)"
          placeholderTextColor="#ABB2B9"
          keyboardType="numeric"
        />

          {parseFloat(descuento) > 0 && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.label}>Fecha de Fin del Descuento</Text>
            <TouchableOpacity onPress={() => setShowFechaFinDescuentoPicker(true)} style={styles.input}>
              <Text style={styles.dateText}>{fechaFinDescuento.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>
            {showFechaFinDescuentoPicker && (
              <DateTimePicker
                value={fechaFinDescuento}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowFechaFinDescuentoPicker(false);
                  if (selectedDate) setFechaFinDescuento(selectedDate);
                }}
              />
            )}
          </Animated.View>
        )}


        <Text style={styles.label}>Fecha de Compra</Text>
        <TouchableOpacity onPress={() => setShowFechaCompraPicker(true)} style={styles.input}>
          <Text style={styles.dateText}>{fechaCompra.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showFechaCompraPicker && (
          <DateTimePicker
            value={fechaCompra}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFechaCompraPicker(false);
              if (selectedDate) setFechaCompra(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Fecha de Vencimiento</Text>
        <TouchableOpacity onPress={() => setShowFechaVencimientoPicker(true)} style={styles.input}>
          <Text style={styles.dateText}>{fechaVencimiento.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showFechaVencimientoPicker && (
          <DateTimePicker
            value={fechaVencimiento}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFechaVencimientoPicker(false);
              if (selectedDate) setFechaVencimiento(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Código de Barras</Text>
        <TextInput
          style={styles.input}
          value={barcode}
          onChangeText={setBarcode}
          placeholder="Código de Barras"
          placeholderTextColor="#ABB2B9"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.solidButton} onPress={handleEditProduct}>
          <Text style={styles.solidButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1A2238',
    padding: 10,
    justifyContent: 'center',
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2D3A59',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderColor: '#3BCEAC',
    borderWidth: 1,
    position: 'relative',
    zIndex: 1,
  },
  dropdownContainer: {
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    borderColor: '#3BCEAC',
    borderWidth: 1,
    marginTop: -10,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  scrollableDropdown: {
    maxHeight: 150,
  },
  dropdownText: {
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3BCEAC',
  },
  searchInput: {
    padding: 10,
    backgroundColor: '#3BCEAC',
    borderRadius: 10,
    marginBottom: 10,
    color: '#1A2238',
  },
  dateText: {
    color: '#FFFFFF',
  },
  solidButton: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#3BCEAC',
    paddingVertical: 15,
    alignItems: 'center',
  },
  solidButtonText: {
    color: '#1A2238',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#3BCEAC', 
    borderColor: '#3BCEAC',
  },
  inactiveButton: {
    backgroundColor: 'transparent',
    borderColor: '#3BCEAC',
  },
  toggleText: {
    fontWeight: 'bold',
  },
  activeText: {
    color: '#1A2238', 
  },
  inactiveText: {
    color: '#ABB2B9', 
  },
});
