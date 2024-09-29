import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,  // Add this import
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddProduct({ navigation, route }) {
  const { scannedBarcode } = route.params || {};
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Lacteos');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descuento, setDescuento] = useState('');
  const [fechaCompra, setFechaCompra] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [barcode, setBarcode] = useState(scannedBarcode || '');;
  const [description, setDescription] = useState('');  // Add description field

  const [showFechaCompraPicker, setShowFechaCompraPicker] = useState(false);
  const [showFechaVencimientoPicker, setShowFechaVencimientoPicker] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    'Lacteos',
    'Carnes',
    'Verduras',
    'Bebidas',
    'Snacks',
  ];

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleAddProduct = () => {
    if (nombre.trim() === '' || precio === '' || stock === '' || barcode.trim() === '') {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios.');
      return;
    }

    if (isNaN(precio) || isNaN(stock)) {
      Alert.alert('Error', 'Precio y Stock deben ser valores numéricos.');
      return;
    }

    if (barcode.length !== 13 || isNaN(barcode)) {
      Alert.alert('Error', 'El código de barras debe contener exactamente 13 dígitos.');
      return;
    }

    // Show the modal after successful product addition
    setModalVisible(true);

    console.log({
      nombre,
      categoria,
      precio,
      stock,
      descuento: descuento || 0,
      fechaCompra: fechaCompra.toISOString().split('T')[0],
      fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
      barcode,
      description,
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack(); // Return to the previous screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Modal for confirmation */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Icon name="check-circle" size={60} color="#4caf50" />
      <Text style={styles.modalTitle}>¡Producto Agregado!</Text>
      <Text style={styles.modalMessage}>El nuevo producto ha sido agregado correctamente.</Text>
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity onPress={() => { setModalVisible(false); }} style={styles.addMoreButton}>
          <Text style={styles.addMoreButtonText}>Agregar Otro</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={closeModal} style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Terminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Agregar Producto</Text>
      </View>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del producto"
        placeholderTextColor="#ABB2B9"
      />

      <Text style={styles.label}>Categoría</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={toggleDropdown}
      >
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

      <TouchableOpacity style={styles.solidButton} onPress={handleAddProduct}>
        <Text style={styles.solidButtonText}>Agregar Producto</Text>
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
    borderColor: '#3BCEAC', // Border color for selection
    borderWidth: 1,
    position: 'relative', // Ensure position works properly
    zIndex: 1, // Keep dropdown above other elements
  },
  dropdownContainer: {
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    borderColor: '#3BCEAC',
    borderWidth: 1,
    marginTop: -10, // Attach to input without split
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
addMoreButton: {
  backgroundColor: '#f1c40f',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  marginRight: 10,
},
addMoreButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
finishButton: {
  backgroundColor: '#4caf50',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
},
finishButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
});
