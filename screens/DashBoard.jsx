import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  ToastAndroid, // Importamos ToastAndroid para Android (para iOS usar Alert)
  Platform,
  Alert,
} from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
} from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const salesData = [
  { name: 'Ene', ventas: 4000, prediccion: 3800 },
  { name: 'Feb', ventas: 3000, prediccion: 3200 },
  { name: 'Mar', ventas: 5000, prediccion: 4800 },
  { name: 'Abr', ventas: 4500, prediccion: 4700 },
  { name: 'May', ventas: 6000, prediccion: 5800 },
  { name: 'Jun', ventas: 5500, prediccion: 5700 },
];

const categoryData = [
  { name: 'Electrónicos', value: 400 },
  { name: 'Ropa', value: 300 },
  { name: 'Alimentos', value: 300 },
  { name: 'Hogar', value: 200 },
];

const productPredictions = [
  { name: 'Smartphone X', probabilidad: 0.85 },
  { name: 'Laptop Y', probabilidad: 0.72 },
  { name: 'Tablet Z', probabilidad: 0.68 },
  { name: 'Smartwatch A', probabilidad: 0.61 },
  { name: 'Auriculares B', probabilidad: 0.57 },
];

export default function ResponsiveDashboard({ navigation }) {
  const { width } = useWindowDimensions();
  const chartWidth = width - 40; // Ajusta según el padding total (20 * 2)

  // Función para manejar clics en puntos de datos
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
          <Text style={styles.title}>Dashboard de Ventas</Text>
          <View style={styles.headerIcons}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#3BCEAC"
              style={styles.icon}
            />
            <Ionicons
              name="settings-outline"
              size={24}
              color="#3BCEAC"
              style={styles.icon}
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
          {/* Tarjeta 1 */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Ventas Totales</Text>
              <Ionicons name="cash-outline" size={20} color="#3BCEAC" />
            </View>
            <Text style={styles.cardValue}>$45,231.89</Text>
            <Text style={styles.cardSubtitle}>+20.1% del mes pasado</Text>
          </View>
          {/* Tarjeta 2 */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Productos Vendidos</Text>
              <Ionicons name="cube-outline" size={20} color="#3BCEAC" />
            </View>
            <Text style={styles.cardValue}>1,234</Text>
            <Text style={styles.cardSubtitle}>+15% del mes pasado</Text>
          </View>
          {/* Tarjeta 3 */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Nuevos Clientes</Text>
              <Ionicons name="people-outline" size={20} color="#3BCEAC" />
            </View>
            <Text style={styles.cardValue}>321</Text>
            <Text style={styles.cardSubtitle}>+5% del mes pasado</Text>
          </View>
        </View>

        {/* Gráfico de Tendencia de Ventas vs Predicción */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Tendencia de Ventas vs Predicción</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: salesData.map((item) => item.name),
                datasets: [
                  {
                    data: salesData.map((item) => item.ventas),
                    color: (opacity = 1) => `rgba(59, 206, 172, ${opacity})`,
                    strokeWidth: 2,
                    label: 'Ventas',
                  },
                  {
                    data: salesData.map((item) => item.prediccion),
                    color: (opacity = 1) => `rgba(255, 128, 66, ${opacity})`,
                    strokeWidth: 2,
                    label: 'Predicción',
                  },
                ],
                legend: ['Ventas', 'Predicción'],
              }}
              width={chartWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#1A2238',
                backgroundGradientFrom: '#1A2238',
                backgroundGradientTo: '#1A2238',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '3',
                  strokeWidth: '1',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={styles.chart}
              onDataPointClick={handleDataPointClick}
            />
          </View>
        </View>

        {/* Gráfico de Distribución de Ventas por Categoría */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Distribución de Ventas por Categoría</Text>
          <View style={styles.chartWrapper}>
            <PieChart
              data={categoryData.map((item, index) => ({
                name: item.name,
                population: item.value,
                color: COLORS[index],
                legendFontColor: '#FFF',
                legendFontSize: 12,
              }))}
              width={chartWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#1A2238',
                backgroundGradientFrom: '#1A2238',
                backgroundGradientTo: '#1A2238',
                color: (opacity = 1) => `rgba(59, 206, 172, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              // Interactividad en PieChart no está directamente soportada
            />
          </View>
        </View>

        {/* Gráfico de Ventas Mensuales */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Ventas Mensuales</Text>
          <View style={styles.chartWrapper}>
            <BarChart
              data={{
                labels: salesData.map((item) => item.name),
                datasets: [
                  {
                    data: salesData.map((item) => item.ventas),
                    color: (opacity = 1) => `rgba(59, 206, 172, ${opacity})`,
                    label: 'Ventas',
                  },
                  {
                    data: salesData.map((item) => item.prediccion),
                    color: (opacity = 1) => `rgba(255, 128, 66, ${opacity})`,
                    label: 'Predicción',
                  },
                ],
                legend: ['Ventas', 'Predicción'],
              }}
              width={chartWidth}
              height={220}
              fromZero
              chartConfig={{
                backgroundColor: '#1A2238',
                backgroundGradientFrom: '#1A2238',
                backgroundGradientTo: '#1A2238',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                barPercentage: 0.5,
              }}
              style={styles.chart}
              onDataPointClick={handleDataPointClick}
            />
          </View>
        </View>

        {/* Predicción de Ventas de Productos */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Predicción de Ventas de Productos (ML)</Text>
          <View style={styles.chartWrapper}>
            {productPredictions.map((item, index) => (
              <View key={index} style={styles.productRow}>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${item.probabilidad * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.productProbability}>
                  {(item.probabilidad * 100).toFixed(0)}%
                </Text>
              </View>
            ))}
          </View>
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
    paddingHorizontal: 10, // Aumentado de 15 a 20
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
    marginBottom: "10%",
    paddingHorizontal: "5%",
    height: "3%",
  },
  searchIcon: {
    marginRight: "2%",
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
  cardValue: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 5,
    flexShrink: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#3BCEAC',
    flexShrink: 1,
  },
  chartContainer: {
    backgroundColor: '#2D3A59',
    borderRadius: 8,
    padding: 20, // Aumentado para más espacio interno
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
  chartWrapper: {
    padding: 10, // Añade padding alrededor del gráfico
  },
  chart: {
    alignSelf: 'center',
    borderRadius: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  productName: {
    flex: 1,
    color: 'white',
    flexShrink: 1,
  },
  progressBarBackground: {
    flex: 2,
    height: 10,
    backgroundColor: '#D1D1D1',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressBarFill: {
    height: 10,
    borderRadius: 5,
  },
  productProbability: {
    minWidth: 50,
    color: 'white',
    textAlign: 'right',
  },
 filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterLabel: {
    color: 'white',
    marginRight: 10,
  },
  datePickerButton: {
    backgroundColor: '#2D3A59',
    padding: 10,
    borderRadius: 8,
    marginRight: 20,
  },
  datePickerText: {
    color: 'white',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#2D3A59',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  modalText: {
    color: 'white',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#3BCEAC',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  modalButtonText: {
    color: '#1A2238',
    fontWeight: 'bold',
  },
});
