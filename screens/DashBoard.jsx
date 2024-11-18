import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  ToastAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function ResponsiveDashboard({ navigation }) {
  const { width } = useWindowDimensions();
  const chartWidth = width - 40; 
  const [ventas, setVentas] = useState([]);
  const [detalleVentas, setDetalleVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [productosVendidos, setProductosVendidos] = useState(0);
  const [cantidadClientesNuevos, setCantidadClientesNuevos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ventasPorPeriodo, setVentasPorPeriodo] = useState([]);
  const [predicciones, setPredicciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener ventas
        const ventasResponse = await fetch('http://170.239.85.88:5000/ventas');
        const ventasData = await ventasResponse.json();
        setVentas(ventasData);

        // Calcular total de ventas
        const totalVentasCalculado = ventasData.reduce((acc, venta) => acc + venta.total_con_iva, 0);
        setTotalVentas(totalVentasCalculado);

        // Obtener detalle de ventas
        const detalleVentasResponse = await fetch('http://170.239.85.88:5000/detalleventa');
        const detalleVentasData = await detalleVentasResponse.json();
        setDetalleVentas(detalleVentasData);

        // Calcular productos vendidos
        const totalProductosVendidos = detalleVentasData.reduce((acc, detalle) => acc + detalle.cantidad, 0);
        setProductosVendidos(totalProductosVendidos);

        // Obtener clientes (asumiendo que el tipo de usuario para clientes es 'cliente')
        const clientesResponse = await fetch('http://170.239.85.88:5000/users?tipo_usuario=cliente');
        const clientesData = await clientesResponse.json();
        setClientes(clientesData);

        // Calcular cantidad de clientes nuevos (puedes ajustar el filtro según tus necesidades)
        setCantidadClientesNuevos(clientesData.length);

        // Agrupar ventas cada 4 meses
        const ventasPorPeriodoCalculadas = agruparVentasPorPeriodo(ventasData);
        setVentasPorPeriodo(ventasPorPeriodoCalculadas);

        // Generar predicciones
        const prediccionesCalculadas = generarPredicciones(ventasPorPeriodoCalculadas);
        setPredicciones(prediccionesCalculadas);

      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para agrupar ventas cada 4 meses
  const agruparVentasPorPeriodo = (ventasData) => {
    // Ordenar ventas por fecha
    const ventasOrdenadas = ventasData.sort((a, b) => new Date(a.fecha_venta) - new Date(b.fecha_venta));

    // Inicializar variables
    const ventasPorPeriodo = [];
    let inicioPeriodo = new Date(ventasOrdenadas[0].fecha_venta);
    let totalPeriodo = 0;
    let contadorMeses = 0;

    ventasOrdenadas.forEach((venta) => {
      const fechaVenta = new Date(venta.fecha_venta);
      const diferenciaMeses = (fechaVenta.getFullYear() - inicioPeriodo.getFullYear()) * 12 + (fechaVenta.getMonth() - inicioPeriodo.getMonth());

      if (diferenciaMeses < 4) {
        totalPeriodo += venta.total_con_iva;
      } else {
        ventasPorPeriodo.push(totalPeriodo);
        inicioPeriodo = fechaVenta;
        totalPeriodo = venta.total_con_iva;
      }
    });
    // Añadir el último período
    ventasPorPeriodo.push(totalPeriodo);

    return ventasPorPeriodo;
  };

  // Función para generar predicciones
  const generarPredicciones = (ventasPorPeriodo) => {
    if (ventasPorPeriodo.length < 2) {
      // No hay suficientes datos para calcular tasas de crecimiento
      return [];
    }

    const predicciones = [];
    // Cálculo de la tasa de crecimiento promedio
    let tasasCrecimiento = [];
    for (let i = 1; i < ventasPorPeriodo.length; i++) {
      const ventaActual = ventasPorPeriodo[i];
      const ventaAnterior = ventasPorPeriodo[i - 1];
      // Evitar división por cero
      if (ventaAnterior !== 0) {
        const tasa = (ventaActual - ventaAnterior) / ventaAnterior;
        tasasCrecimiento.push(tasa);
      } else {
        // Si la venta anterior es cero, asumimos una tasa de crecimiento del 100%
        tasasCrecimiento.push(1);
      }
    }

    let tasaCrecimientoPromedio = 0;
    if (tasasCrecimiento.length > 0) {
      tasaCrecimientoPromedio = tasasCrecimiento.reduce((a, b) => a + b, 0) / tasasCrecimiento.length;
    } else {
      // Si no se pueden calcular tasas de crecimiento, asumimos crecimiento cero
      tasaCrecimientoPromedio = 0;
    }

    // Generar predicciones para los próximos períodos
    let ultimoValor = ventasPorPeriodo[ventasPorPeriodo.length - 1];
    for (let i = 0; i < 3; i++) {
      ultimoValor = ultimoValor * (1 + tasaCrecimientoPromedio);
      predicciones.push(ultimoValor);
    }
    return predicciones;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#48BB78" />
      </View>
    );
  }

  // Ejemplo de función para manejar clics en puntos de datos
  const handleDataPointClick = (data) => {
    const message = `Valor: ${data.value} en ${data.dataset.label || data.label}`;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Información del Punto', message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#3BCEAC" />
          </TouchableOpacity>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.headerIcons}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#3BCEAC"
              style={styles.icon}
            />
            <Ionicons
              name="settings-outline"
              size={24} color="#3BCEAC" style={styles.icon}
            />
          </View>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#3BCEAC" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar productos..."
            placeholderTextColor="#D1D1D1"
            style={styles.searchInput}
          />
        </View>

        {/* Tarjetas */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Ventas Totales</Text>
              <Ionicons name="cash-outline" size={20} color="#3BCEAC" />
            </View>
            <Text style={styles.cardValue}>${totalVentas.toFixed(2)}</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Productos Vendidos</Text>
              <Ionicons name="cube-outline" size={20} color="#3BCEAC" />
            </View>
            <Text style={styles.cardValue}>{productosVendidos}</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Nuevos Clientes</Text>
              <Ionicons name="people-outline" size={20} color="#3BCEAC" />
            </View>
            <Text style={styles.cardValue}>{cantidadClientesNuevos}</Text>
          </View>
        </View>

        {/* Gráfico de Tendencia de Ventas vs Predicción */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Tendencia de Ventas vs Predicción</Text>
          <LineChart
            data={{
              labels: ventasPorPeriodo.map((_, index) => `P${index + 1}`),
              datasets: [
                {
                  data: ventasPorPeriodo,
                  color: (opacity = 1) => `rgba(59, 206, 172, ${opacity})`,
                  strokeWidth: 2,
                },
                {
                  data: predicciones,
                  color: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`,
                  strokeWidth: 2,
                  withDots: true,
                },
              ],
            }}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#1A2238',
              backgroundGradientFrom: '#1A2238',
              backgroundGradientTo: '#1A2238',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Gráfico de Distribución de Ventas por Categoría */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribución de Ventas por Categoría</Text>
          {/* Gráfico aquí */}
        </View>

        {/* Gráfico de Ventas Mensuales */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Ventas Mensuales</Text>
          {/* Gráfico aquí */}
        </View>

        {/* Predicción de Ventas de Productos */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Predicción de Ventas de Productos (ML)</Text>
          {/* Contenido aquí */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A2238',
  },
  container: {
    backgroundColor: '#1A2238',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2D3A59',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  backButton: {},
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#2D3A59',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20, // Reemplazado el porcentaje por un número
    paddingHorizontal: 15, // Reemplazado el porcentaje por un número
    height: 40, // Reemplazado el porcentaje por un número
  },
  searchIcon: {
    marginRight: 10, // Reemplazado el porcentaje por un número
  },
  searchInput: {
    flex: 1,
    color: 'white',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2D3A59',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    color: 'white',
    flexShrink: 1,
  },
  chartContainer: {
    backgroundColor: '#2D3A59',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 24,
    color: 'white',
    marginTop: 10,
    fontWeight: 'bold',
  },
});