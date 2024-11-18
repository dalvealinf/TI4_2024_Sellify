import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const HistorialVentas = ({ navigation }) => {
  const [ventas, setVentas] = useState([]); // Datos obtenidos desde la API
  const [startDate, setStartDate] = useState(null); // Fecha de inicio seleccionada
  const [endDate, setEndDate] = useState(null); // Fecha de fin seleccionada
  const [currentPicker, setCurrentPicker] = useState(null); // Controla qué picker está activo (inicio o fin)
  const [show, setShow] = useState(false); // Mostrar el calendario
  const [filteredVentas, setFilteredVentas] = useState([]); // Ventas filtradas
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Función para obtener las ventas desde la API
  const fetchVentas = async (fechaInicio = null, fechaFin = null) => {
    try {
      let url = 'http://170.239.85.88:5000/ventas';

      // Agregar parámetros de fecha si existen
      if (fechaInicio || fechaFin) {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fecha_inicio', fechaInicio);
        if (fechaFin) params.append('fecha_fin', fechaFin);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al obtener las ventas');
      }

      const data = await response.json();
      setVentas(data); // Guardar las ventas
      setFilteredVentas(data); // Se muestran todas las ventas al comienzo
    } catch (error) {
      Alert.alert('Error', error.message || 'Ocurrió un error al obtener las ventas');
    }
  };

  useEffect(() => {
    // Obtener todas las ventas al cargar la pantalla
    fetchVentas();
  }, []);

  // Función para manejar la selección de fechas
  const showPicker = useCallback((pickerType) => {
    if (!isPickerOpen) {
      setCurrentPicker(pickerType);
      setShow(true);
      setIsPickerOpen(true);
    }
  }, [isPickerOpen]);
  
  const onChange = useCallback((event, selectedDate) => {
    if (Platform.OS === "android" && event.type === "dismissed") {
      setShow(false);
      setIsPickerOpen(false);
      return;
    }
  
    if (selectedDate) {
      if (currentPicker === "start") {
        setStartDate(selectedDate);
      } else if (currentPicker === "end") {
        setEndDate(selectedDate);
      }
    }
  
    setShow(false);
    setIsPickerOpen(false);
  }, [currentPicker]);

  // Función para aplicar el filtro con las fechas seleccionadas
  const aplicarFiltro = () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Por favor selecciona ambas fechas.');
      return;
    }

    const fechaInicio = startDate.toISOString().split('T')[0];
    const fechaFin = endDate.toISOString().split('T')[0];
    fetchVentas(fechaInicio, fechaFin);
  };

  // Función para limpiar el filtro de ventas
  const limpiarFiltro = () => {
    setStartDate(null);
    setEndDate(null);
    fetchVentas(); // Cargar todas las ventas
  };

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Función para renderizar una venta
  const renderVenta = ({ item }) => (
    <TouchableOpacity
      style={styles.ventaContainer}
      onPress={() => navigation.navigate("DetalleVenta", { venta: { id: item.id_venta, cajero: item.id_cajero, total: item.total_con_iva } })} // Enviar id de venta y otros datos
    >
      <Text style={styles.fecha}>{formatFecha(item.fecha_venta)}</Text>
      <Text style={styles.total}>Total sin IVA: ${item.total_sin_iva}</Text>
      <Text style={styles.total}>Total con IVA: ${item.total_con_iva}</Text>
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
        <TouchableOpacity style={styles.dateButton} onPress={() => showPicker('start')}>
          <Text style={styles.dateButtonText}>
            {startDate ? `Inicio: ${formatFecha(startDate)}` : 'Seleccionar Fecha de Inicio'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateButton} onPress={() => showPicker('end')}>
          <Text style={styles.dateButtonText}>
            {endDate ? `Fin: ${formatFecha(endDate)}` : 'Seleccionar Fecha de Fin'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={aplicarFiltro} title="Aplicar Filtro" color="#3BCEAC" />
        <Button onPress={limpiarFiltro} title="Limpiar Filtro" color="#FF6B6B" />
      </View>

      {show && (
        <DateTimePicker
        value={currentPicker === 'start' ? startDate || new Date() : endDate || new Date()}
        mode="date"
        is24Hour={true}
        display="default"
        onChange={onChange}
      />
      )}

      <FlatList
        data={filteredVentas}
        keyExtractor={(item) => item.id_venta.toString()}
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
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#1A2238',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
