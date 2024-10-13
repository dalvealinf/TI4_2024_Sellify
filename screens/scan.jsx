import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, Modal } from "react-native";
import { CameraView, Camera } from "expo-camera";
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function BarcodeScannerPage({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false); 
      setIsReadyToScan(true); // Reset scan status on focus
    }, [])
  );

  const [isReadyToScan, setIsReadyToScan] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [buttonOpacity] = useState(new Animated.Value(0));

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    setModalVisible(true);
    setIsReadyToScan(false); // Disable scanning after successful scan
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalVisible(false);
    setScanned(false); // Allow the scanner to be used again
    setBarcodeData(''); // Clear the scanned data
    setIsReadyToScan(true); // Re-enable scanning
  };

  const goToAddProduct = () => {
    setModalVisible(false);
    navigation.navigate('AddProduct', { scannedBarcode: barcodeData }); // Navigate to AddProduct and pass barcode data
  };

  const goToInventory = () => {
    setModalVisible(false);
    navigation.navigate('InventoryScreen', { searchBarcode: barcodeData }); // Navigate to InventoryScreen and pass barcode data
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Icon name="checkmark-circle" size={60} color="#4caf50" />
            <Text style={styles.modalTitle}>¡Producto Escaneado!</Text>
            <Text style={styles.modalMessage}>Código escaneado: {barcodeData}</Text>
            <View style={styles.modalButtonContainer}>
              <View style={styles.firstButtonRow}>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity onPress={goToAddProduct} style={[styles.button, styles.addMoreButton]}>
                    <Text style={styles.addMoreButtonText}>Agregar Producto</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity onPress={goToInventory} style={[styles.button, styles.searchButton]}>
                    <Text style={styles.searchButtonText}>Buscar Producto</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.scanAgainButton}>
                <Text style={styles.scanAgainButtonText}>Escanear de Nuevo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Escanear Producto</Text>
      </View>

      {/* Camera View */}
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [ "ean13"],
        }}
        style={styles.camera}
      />

      <View style={styles.scanStatusContainer}>
        {isReadyToScan ? (
          <Icon name="barcode" size={40} color="green" />
        ) : (
          <Icon name="close-circle" size={40} color="red" />
        )}
        <Text style={styles.scanStatusText}>
          {isReadyToScan ? 'Escanee el producto' : 'No se puede escanear en este momento'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A2238",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#2D3A59', 
    borderRadius: 20,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
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
  camera: {
    flex: 1,
    marginTop: 0,
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
    width: '90%',
    maxWidth: 400,
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
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  firstButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreButton: {
    backgroundColor: '#f1c40f',
    paddingVertical: 15,
    marginRight: 5,
  },
  addMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#1abc9c',
    paddingVertical: 15,
    marginLeft: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scanAgainButton: {
    backgroundColor: '#e67e22',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignSelf: 'center',
    width: '100%', // Full width for the scan again button
  },
  scanAgainButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center', // Center text inside button
  },
  // Scan status indicator styles
  scanStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  scanStatusText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
  },
});
