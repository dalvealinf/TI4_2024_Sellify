import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProduct({ route, navigation }) {
  const { product } = route.params;

  // Helper function to validate dates
  const validateDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date : new Date(); // Use current date if invalid
  };

  const [nombre, setNombre] = useState((product.nombre) || '');
  const [categoria, setCategoria] = useState((product.categoria) || 'Lacteos');
  const [precio, setPrecio] = useState((product.precio_venta) || '');
  const [stock, setStock] = useState(product.stock ? String(product.stock) : '');
  const [descuento, setDescuento] = useState((product.descuento) || '0');
  const [fechaCompra, setFechaCompra] = useState(validateDate(product.fecha_registro));
  const [fechaVencimiento, setFechaVencimiento] = useState(validateDate(product.fecha_vencimiento));
  const [barcode, setBarcode] = useState((product.codigo_barras) || '');
  const [description, setDescription] = useState((product.descripcion) || '');

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customCategory, setCustomCategory] = useState(categoria);

  const [showFechaCompraPicker, setShowFechaCompraPicker] = useState(false);
  const [showFechaVencimientoPicker, setShowFechaVencimientoPicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [addAgainModalVisible, setAddAgainModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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

  // Function to edit the product via the API
  const handleEditProduct = async () => {
    const updatedProduct = {
      nombre: nombre,
      descripcion: description,
      fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
      stock: parseInt(stock),
      descuento: descuento ? parseFloat(descuento) : 0,
      precio_venta: parseFloat(precio),
      estado: "activo", 
      categoria,
    };

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

  // Function to add the product again with new data via the API
  const handleAddAgain = async () => {
    const newProduct = {
      nombre,
      descripcion: description,
      fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
      stock: parseInt(stock),
      descuento: descuento ? parseFloat(descuento) : 0,
      precio_venta: parseFloat(precio),
      estado: "activo", 
      categoria,
      codigo_barras: barcode,
    };
    console.log('Adding product again with data:', newProduct);
    try {
      const response = await fetch('http://170.239.85.88:5000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const result = await response.json();

      if (response.ok) {
        setAddAgainModalVisible(true); // Show success modal
      } else {
        setErrorMessage(result.msg || 'Hubo un error al agregar el producto');
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error adding product again:', error);
      setErrorMessage('No se pudo conectar con el servidor.');
      setErrorModalVisible(true);
    }
  };

  const closeEditModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const closeAddAgainModal = () => {
    setAddAgainModalVisible(false);
    navigation.goBack();
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
          visible={addAgainModalVisible}
          onRequestClose={closeAddAgainModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Icon name="check-circle" size={60} color="#4caf50" />
              <Text style={styles.modalTitle}>¡Producto Agregado de Nuevo!</Text>
              <TouchableOpacity onPress={closeAddAgainModal} style={styles.finishButton}>
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
              <Icon name="alert-circle" size={60} color="#e74c3c" />
              <Text style={styles.modalTitle}>Error</Text>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
              <TouchableOpacity onPress={() => setErrorModalVisible(false)} style={styles.finishButton}>
                <Text style={styles.finishButtonText}>Cerrar</Text>
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
          <View style={styles.dropdownContainer}>
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
          </View>
        )}

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

        <TouchableOpacity style={styles.secondaryButton} onPress={handleAddAgain}>
          <Text style={styles.secondaryButtonText}>Agregar Con Nuevos Datos</Text>
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
    position: 'relative', // For dropdown alignment
    zIndex: 1,
  },
  dropdownContainer: {
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    borderColor: '#3BCEAC',
    borderWidth: 1,
    marginTop: -10, // Attach to input field seamlessly
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
  secondaryButton: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
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
