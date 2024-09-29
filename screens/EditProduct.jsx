import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProduct({ route, navigation }) {
  const { product } = route.params; // Receive the product data through navigation

  // State with the product data
  const [nombre, setNombre] = useState(product.name || '');
  const [categoria, setCategoria] = useState(product.categoria || 'Lacteos');
  const [precio, setPrecio] = useState(product.precio || '');
  const [stock, setStock] = useState(product.stock || '');
  const [descuento, setDescuento] = useState(product.descuento || '');
  const [fechaCompra, setFechaCompra] = useState(new Date(product.fechaCompra));
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date(product.fechaVencimiento));
  const [barcode, setBarcode] = useState(product.barcode || '');
  const [description, setDescription] = useState(product.description || '');

  // Dropdown control states
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showFechaCompraPicker, setShowFechaCompraPicker] = useState(false);
  const [showFechaVencimientoPicker, setShowFechaVencimientoPicker] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [addAgainModalVisible, setAddAgainModalVisible] = useState(false);

  const categories = ['Lacteos', 'Carnes', 'Verduras', 'Bebidas', 'Snacks'];

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleEditProduct = () => {
    setModalVisible(true);
    console.log('Product edited with:', {
      nombre, categoria, precio, stock, descuento, barcode, fechaCompra, fechaVencimiento, description,
    });
  };

  const handleAddAgain = () => {
    setAddAgainModalVisible(true);
    console.log('Product added again with:', {
      nombre, categoria, precio, stock, descuento, barcode, fechaCompra, fechaVencimiento, description,
    });
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Modal for editing */}
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

      {/* Modal for adding again */}
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
        <Text style={styles.dropdownText}>{categoria}</Text>
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdownContainer}>
          <ScrollView style={styles.scrollableDropdown} nestedScrollEnabled={true}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setCategoria(item);
                  toggleDropdown();
                }}
              >
                <Text style={styles.dropdownText}>{item}</Text>
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

      {/* Buttons for editing and adding again */}
      <TouchableOpacity style={styles.solidButton} onPress={handleEditProduct}>
        <Text style={styles.solidButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleAddAgain}>
        <Text style={styles.secondaryButtonText}>Agregar Con Nuevos Datos</Text>
      </TouchableOpacity>
    </ScrollView>
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
  