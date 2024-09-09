import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { CameraView, Camera } from "expo-camera";
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BarcodeScannerPage({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [buttonOpacity] = useState(new Animated.Value(0));

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
    alert(`Código de barras tipo ${type} con datos ${data} ha sido escaneado!`);
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
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

      {/* Animated Button and Scanned Code */}
      {scanned && (
        <Animated.View style={[styles.bottomView, { opacity: buttonOpacity }]}>
          <TouchableOpacity style={styles.scanButton} onPress={() => { setScanned(false); setBarcodeData(''); }}>
            <LinearGradient colors={['#007B83', '#00B2A9']} style={styles.buttonGradient}>
              <Text style={styles.scanButtonText}>Escanear de nuevo</Text>
            </LinearGradient>
          </TouchableOpacity>
          {barcodeData ? <Text style={styles.codeText}>Código escaneado: {barcodeData}</Text> : null}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centers the title
    paddingVertical: 15,
    backgroundColor: '#34495E', // Light background for the title
    borderRadius: 20,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute', // Positioning it absolutely
    left: 15, // Moves the back arrow to the right slightly
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
  bottomView: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  scanButton: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 80,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeText: {
    fontSize: 16,
    marginTop: 10,
    padding: 10,
    backgroundColor: "#34495E",
    color: "#fff",
    borderRadius: 5,
  },
});
