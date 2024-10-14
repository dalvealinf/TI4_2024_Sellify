import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AddProduct({ navigation, route }) {
  const { scannedBarcode } = route.params || {};
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descuento, setDescuento] = useState('0');
  const [fechaCompra, setFechaCompra] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [barcode, setBarcode] = useState(scannedBarcode || '');
  const [description, setDescription] = useState('');

  const [showFechaCompraPicker, setShowFechaCompraPicker] = useState(false);
  const [showFechaVencimientoPicker, setShowFechaVencimientoPicker] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [categorySuccessModalVisible, setCategorySuccessModalVisible] = useState(false); // New success modal state
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://170.239.85.88:5000/categories');
      const result = await response.json();
      setCategories(result);
      setFilteredCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
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

  const handleAddProduct = async () => {
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

    const productData = {
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

    try {
      const response = await fetch('http://170.239.85.88:5000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok) {
        setModalVisible(true);
      } else {
        Alert.alert('Error', result.msg || 'Hubo un error al agregar el producto');
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') {
      Alert.alert('Error', 'El nombre de la categoría no puede estar vacío.');
      return;
    }

    try {
      const response = await fetch('http://170.239.85.88:5000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_categoria: newCategoryName }),
      });

      const result = await response.json();

      if (response.ok) {
        setAddCategoryModalVisible(false);
        setCategorySuccessModalVisible(true); // Show success modal
        setNewCategoryName(''); // Reset the input field after success
        fetchCategories(); // Refresh categories after adding a new one
      } else {
        Alert.alert('Error', result.msg || 'Hubo un error al agregar la categoría');
      }
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={handleFieldPress}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Modal for Add Product */}
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

        {/* Success Modal for Category Addition */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={categorySuccessModalVisible}
          onRequestClose={() => setCategorySuccessModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Icon name="check-circle" size={60} color="#4caf50" />
              <Text style={styles.modalTitle}>¡Categoría Agregada!</Text>
              <Text style={styles.modalMessage}>La nueva categoría ha sido agregada correctamente.</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity onPress={() => { setCategorySuccessModalVisible(false); }} style={styles.finishButton}>
                  <Text style={styles.finishButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal for Add Category */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addCategoryModalVisible}
          onRequestClose={() => setAddCategoryModalVisible(false)}
        >
          <View style={styles.addCategoryModalBackground}> 
            <View style={styles.addCategoryModalContainer}> 
              <Text style={styles.addCategoryModalTitle}>Agregar Nueva Categoría</Text>
              <TextInput
                style={styles.addCategoryInput} 
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="Nombre de la categoría"
                placeholderTextColor="#ABB2B9"
              />
              <View style={styles.addCategoryModalButtonContainer}>
                <TouchableOpacity onPress={handleAddCategory} style={styles.addCategorySolidButton}>
                  <Text style={styles.addCategorySolidButtonText}>Agregar Categoría</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAddCategoryModalVisible(false)} style={styles.addCategoryCancelButton}>
                  <Text style={styles.addCategoryCancelButtonText}>Cancelar</Text>
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
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => setAddCategoryModalVisible(true)}
          >
            <Text style={styles.addCategoryText}>Agregar Categoría</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del producto"
          placeholderTextColor="#ABB2B9"
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

        <Text style={styles.label}>Descuento (%) (opcional)</Text>
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
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  backButton: {
    marginLeft: 8,
  },
  addCategoryButton: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#3BCEAC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addCategoryText: {
    color: '#1A2238',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    flex: 1, 
    marginLeft: 1,
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

  // Styles for AddCategoryModal (isolated from other modals)
  addCategoryModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  addCategoryModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  addCategoryModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A2238',
  },
  addCategoryInput: {
    width: '100%',
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ABB2B9',
    marginBottom: 20,
    color: '#1A2238',
  },
  addCategoryModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addCategorySolidButton: {
    backgroundColor: '#3BCEAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addCategorySolidButtonText: {
    color: '#1A2238',
    fontWeight: 'bold',
  },
  addCategoryCancelButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  addCategoryCancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Existing styles for the product modal:
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

  // New styles for the Success Modal when adding a category
  categorySuccessModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Same background as other modals
  },
  categorySuccessModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  categorySuccessModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#1A2238',
  },
  categorySuccessModalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A2238',
  },
  categorySuccessButtonContainer: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
});
