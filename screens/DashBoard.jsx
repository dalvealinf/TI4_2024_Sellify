import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get("window").width;

export default function MobileDashboard({ navigation }) {
  const [selectedView, setSelectedView] = useState('week');
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const salesData = {
    labels: ["L", "M", "X", "J", "V", "S", "D"],
    datasets: [
      {
        label: "Ventas",
        data: [4500, 5200, 3800, 5700, 6100, 7200, 6800],
        backgroundColor: "rgba(129, 140, 248, 0.6)",
        borderColor: "rgba(129, 140, 248, 1)",
        borderWidth: 2,
        barPercentage: 0.6,
      },
    ],
  };

  const inventoryData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Inventario",
        data: [1200, 1900, 2400, 2800, 3100, 3500],
        borderColor: "#48BB78",
        backgroundColor: "rgba(72, 187, 120, 0.2)",
        fill: true,
        tension: 0.4,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E3A8A",
    backgroundGradientTo: "#1E3A8A",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Datos en tiempo real</Text>
      </View>

      <View style={styles.pickerWrapperContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedView}
            style={styles.picker}
            dropdownIconColor="white"
            onValueChange={(itemValue) => setSelectedView(itemValue)}
          >
            <Picker.Item label="Hoy" value="day" style={styles.pickerItem} />
            <Picker.Item label="Esta semana" value="week" style={styles.pickerItem} />
            <Picker.Item label="Este mes" value="month" style={styles.pickerItem} />
          </Picker>
        </View>
      </View>

      {/* Cards for Sales and Inventory */}
      <View style={styles.cardContainer}>
        <View style={[styles.card, styles.salesCard]}>
          <Text style={styles.cardTitle}>
            <Ionicons name="cash-outline" size={16} color="white" /> Ventas
          </Text>
          <Text style={styles.cardContent}>$39,300</Text>
          <Text style={styles.cardSubContent}>+15.3% vs anterior</Text>
        </View>
        <View style={[styles.card, styles.inventoryCard]}>
          <Text style={styles.cardTitle}>
            <Ionicons name="cube-outline" size={16} color="white" /> Inventario
          </Text>
          <Text style={styles.cardContent}>6,700</Text>
          <Text style={styles.cardSubContent}>Productos</Text>
        </View>
      </View>

      {/* Sales Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>
            <Ionicons name="bar-chart-outline" size={20} color="#9F7AEA" /> Ventas Diarias
          </Text>
          <TouchableOpacity onPress={() => openModal('sales')}>
            <Ionicons name="expand-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <BarChart
          data={salesData}
          width={screenWidth - 40}
          height={260}
          yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          showBarTops={false}
          fromZero={true}
          style={styles.chart}
        />
      </View>

      {/* Inventory Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>
            <Ionicons name="trending-up-outline" size={20} color="#48BB78" /> Nivel de Inventario
          </Text>
          <TouchableOpacity onPress={() => openModal('inventory')}>
            <Ionicons name="expand-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <LineChart
          data={inventoryData}
          width={screenWidth - 40}
          height={260}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Top Products List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="pricetags-outline" size={16} color="white" /> Top Productos
        </Text>
        <ScrollView style={{ maxHeight: 200 }}>
          {[
            { name: "Smartphone X", units: 1234, revenue: 617000 },
            { name: "Laptop Pro", units: 987, revenue: 1184400 },
            { name: "Auriculares BT", units: 1765, revenue: 158850 },
            { name: "Smartwatch Elite", units: 843, revenue: 168600 },
            { name: "Cámara 4K", units: 621, revenue: 248400 },
          ].map((product, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productUnits}>{product.units} unidades</Text>
              </View>
              <Text style={styles.productRevenue}>${product.revenue.toLocaleString()}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modal for Enlarged Charts */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close-outline" size={36} color="white" />
          </TouchableOpacity>
          <View style={styles.modalContent}>
            {modalContent === 'sales' ? (
              <BarChart
                data={salesData}
                width={screenWidth}
                height={400}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                showBarTops={false}
                fromZero={true}
                style={styles.chart}
              />
            ) : modalContent === 'inventory' ? (
              <LineChart
                data={inventoryData}
                width={screenWidth}
                height={400}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3748',
  },
  contentContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#34495E', // Light background for the header
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  pickerWrapperContainer: {
    marginBottom: 20,
  },
  pickerWrapper: {
    backgroundColor: '#4A5568',
    borderRadius: 5,
    overflow: 'hidden', // ensures picker is contained
  },
  picker: {
    height: 40,
    width: '100%',
    color: 'white',
  },
  pickerItem: {
    color: 'black',
    fontSize: 14,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
  },
  salesCard: {
    backgroundColor: '#9F7AEA',
  },
  inventoryCard: {
    backgroundColor: '#48BB78',
  },
  cardTitle: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  cardSubContent: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  chartContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    color: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalContent: {
    padding: 20,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: 'white',
  },
  productUnits: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  productRevenue: {
    fontSize: 14,
    color: 'white',
  },
});
