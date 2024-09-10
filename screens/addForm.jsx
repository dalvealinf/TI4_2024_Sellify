import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddProduct({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Lacteos');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descuento, setDescuento] = useState('');
  const [fechaCompra, setFechaCompra] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [barcode, setBarcode] = useState('');

  const [showFechaCompraPicker, setShowFechaCompraPicker] = useState(false);
  const [showFechaVencimientoPicker, setShowFechaVencimientoPicker] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

    console.log({
      nombre,
      categoria,
      precio,
      stock,
      descuento: descuento || 0,
      fechaCompra: fechaCompra.toISOString().split('T')[0],
      fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
      barcode,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <LinearGradient
          colors={['#007B83', '#00B2A9']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Agregar Producto</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2C3E50',
    padding: 10,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#34495E',
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
    backgroundColor: '#34495E',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  dropdownContainer: {
    backgroundColor: '#34495E',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
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
    borderBottomColor: '#2C3E50',
  },
  dateText: {
    color: '#FFFFFF',
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
