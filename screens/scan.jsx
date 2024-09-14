import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, Modal } from "react-native";
import { CameraView, Camera } from "expo-camera";
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BarcodeScannerPage({ navigation }) {
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
    // Show the modal instead of an alert
    setModalVisible(true);
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
  };

  const goToAddProduct = () => {
    setModalVisible(false);
    navigation.navigate('AddProduct', { scannedBarcode: barcodeData }); // Navigate to AddProduct and pass barcode data
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Modal for successful scan */}
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
              <TouchableOpacity onPress={goToAddProduct} style={styles.addMoreButton}>
                <Text style={styles.addMoreButtonText}>Agregar Producto</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.finishButton}>
                <Text style={styles.finishButtonText}>Terminar</Text>
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
          barcodeTypes: ["qr", "ean13"], // You can adjust types as needed
        }}
        style={styles.camera}
      />
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
