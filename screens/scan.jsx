import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, Modal } from "react-native";
import { CameraView, Camera } from "expo-camera";
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import io from 'socket.io-client';

export default function BarcodeScannerPage({ navigation }) {
  const [isReadyToScan, setIsReadyToScan] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [buttonOpacity] = useState(new Animated.Value(0));
  const [userType, setUserType] = useState('');
  const [userRut, setUserRut] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Manejar el estado del escaneo cuando la screen está en uso
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false); 
      setIsReadyToScan(true);

      return () => {
        if (isConnected && socketRef.current) {
          socketRef.current.disconnect();
          setIsConnected(false);
          console.log('Desconectado del servidor WebSocket');
        }
      };
    }, [isConnected])
  );

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    const obtenerTipoUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://170.239.85.88:5000/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserType(data.tipo_usuario);
        setUserRut(data.rut);
      } catch (error) {
        console.error('Error al obtener el tipo de usuario y rut:', error);
      }
    };
    getCameraPermissions();
    obtenerTipoUsuario();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    setModalVisible(true);
    setIsReadyToScan(false);

    if (socketRef.current && userRut) {
      socketRef.current.emit('barcode_scanned', { barcode: data, rut: userRut });
    }

    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalVisible(false);
    setScanned(false);
    setBarcodeData('');
    setIsReadyToScan(true);
  };

  const goToAddProduct = () => {
    setModalVisible(false);
    navigation.navigate('AddProduct', { scannedBarcode: barcodeData });
  };

  const goToInventory = () => {
    setModalVisible(false);
    navigation.navigate('InventoryScreen', { searchBarcode: barcodeData });
  };

  const handleLinkToWeb = () => {
    if (isConnected) {
      socketRef.current.disconnect();
      setIsConnected(false);
      console.log('Desconectado del servidor WebSocket');
    } else {
      socketRef.current = io('http://170.239.85.88:5000');
      
      socketRef.current.on('connect', () => {
        console.log('Conectado al servidor WebSocket');
        setIsConnected(true);
        socketRef.current.emit('scan_request', { rut: userRut });
      });

      socketRef.current.off('scan_response');
      socketRef.current.on('scan_response', (data) => {
        if (data.message === 'Escaneo iniciado') {
          setErrorMessage('Escaneo iniciado exitosamente en la web');
          setErrorModalVisible(true);
        } else {
          setErrorMessage('Error en el proceso de escaneo');
          setErrorModalVisible(true);
        }
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Error de conexión WebSocket:', error);
        setErrorMessage('No se pudo conectar con la API');
        setErrorModalVisible(true);
      });
    }
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
                {userType === 'admin' && (
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={goToAddProduct} style={[styles.button, styles.addMoreButton]}>
                      <Text style={styles.addMoreButtonText}>Agregar Producto</Text>
                    </TouchableOpacity>
                  </View>
                )}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Icon name="alert-circle" size={60} color="#FF6B6B" />
            <Text style={styles.modalTitle}>Aviso</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: '#FF6B6B' }]}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Escanear Producto</Text>
        <TouchableOpacity 
          onPress={handleLinkToWeb} 
          style={[
            styles.linkButton, 
            isConnected ? styles.connectedBorder : styles.disconnectedBorder
          ]}
        >
          <Icon name={isConnected ? 'unlink-outline' : 'link-outline'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13"],
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
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    width: '100%', 
  },
  scanAgainButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
  linkButton: {
    position: 'absolute',
    right: 15,
  },
  connectedBorder: {
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 10,
    padding: 4,
  },
  disconnectedBorder: {
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 10,
    padding: 4,
  },
});