import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const ventas = [
    { id: '1', fecha: '2024-09-07', hora: '14:35', total: '$617,000', cajero: 'Juan Pérez', productos: [
        { id: '1', nombre: 'Iphone X', precio: '$400,000' },
        { id: '2', nombre: 'Laptop Asus', precio: '$217,000' },
      ],
    },
    { id: '2', fecha: '2024-09-06', hora: '11:20', total: '$1,184,400', cajero: 'María López', productos: [
        { id: '1', nombre: 'Auriculares BT', precio: '$158,850' },
        { id: '2', nombre: 'Smartwatch Xiaomi', precio: '$168,600' },
      ],
    },
  ];

// Función para ordenar las ventas por la fecha más reciente
const ordenarVentasPorFecha = (ventas) => {
  return ventas.sort((a, b) => {
    const fechaA = new Date(`${a.fecha}T${a.hora}`);
    const fechaB = new Date(`${b.fecha}T${b.hora}`);
    return fechaB - fechaA; // Ordenar de más reciente a más antigua
  });
};

// Función para filtrar las ventas por la fecha seleccionada
const filtrarVentasPorFecha = (ventas, fechaSeleccionada) => {
  return ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha); // Convertir la fecha de la venta a Date
    return (
      fechaVenta.getFullYear() === fechaSeleccionada.getFullYear() &&
      fechaVenta.getMonth() === fechaSeleccionada.getMonth() &&
      fechaVenta.getDate() === fechaSeleccionada.getDate()
    );
  });
};

const HistorialVentas = ({ navigation }) => {
  const [date, setDate] = useState(null); // Fecha seleccionada
  const [mode, setMode] = useState('date'); // Modo date
  const [show, setShow] = useState(false); // Mostrar el calendario
  const [filteredVentas, setFilteredVentas] = useState(ventas);

  // Función que maneja el cambio cuando se selecciona una fecha
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Solución para que el calendario se cierre correctamente
    setDate(currentDate);

    // Filtrar las ventas según la fecha seleccionada
    const ventasFiltradas = filtrarVentasPorFecha(ventas, currentDate);
    setFilteredVentas(ventasFiltradas);
  };

  // Función para mostrar el calendario para seleccionar la fecha
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  // Función para limpiar el filtro de ventas
  const limpiarFiltro = () => {
    setDate(null);
    setFilteredVentas(ventas);
  };

  // Ordenar las ventas antes de mostrarlas
  const ventasOrdenadas = ordenarVentasPorFecha(filteredVentas);

  const renderVenta = ({ item }) => (
    <TouchableOpacity
      style={styles.ventaContainer}
      onPress={() => navigation.navigate('DetalleVenta', { venta: item })}  // Pasar la venta seleccionada
    >
      <Text style={styles.fecha}>{item.fecha} {item.hora}</Text>
      <Text style={styles.total}>Total: {item.total}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Historial de Ventas</Text>
      </View>

      <View style={styles.inputContainer}>
  <TouchableOpacity style={styles.dateButton} onPress={() => showMode('date')}>
    <Text style={styles.dateButtonText}>Seleccionar Fecha</Text>
  </TouchableOpacity>
  <Text style={styles.selectedDate}>
    {date ? `Fecha seleccionada: ${date.toLocaleDateString()}` : 'Ninguna fecha seleccionada'}
  </Text>
</View>

      <View style={styles.clearButtonContainer}>
        <Button onPress={limpiarFiltro} title="Limpiar Filtro" color="#FF6B6B" />
      </View>

      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <FlatList
        data={ventasOrdenadas}
        keyExtractor={item => item.id}
        renderItem={renderVenta}
        style={styles.listaVentas}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2238',
    padding: 20,
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
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#3BCEAC',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#1A2238',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedDate: {
    color: '#F5F6Fa',
    marginTop: 10,
    fontSize: 16,
  },
  clearButtonContainer: {
    marginVertical: 10,
  },
  listaVentas: {
    flex: 1,
  },
  ventaContainer: {
    backgroundColor: '#2D3A59',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  fecha: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  total: {
    fontSize: 16,
    color: '#BDC3C7',
  },
});

export default HistorialVentas;