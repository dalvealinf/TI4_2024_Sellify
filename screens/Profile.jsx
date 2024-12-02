import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        const response = await fetch('http://170.239.85.88:5000/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.msg || 'Error al obtener los datos del usuario');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        Alert.alert('Error', 'Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    obtenerDatosUsuario();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando datos del usuario...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Error al cargar los datos del usuario.</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1A202C', '#2D3748']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar
            size="xlarge"
            rounded
            source={{ uri: user.avatarUrl || "https://placeimg.com/640/480/any" }}
            containerStyle={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Icon name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Nombre y Role */}
        <Text style={styles.nameText}>{`${user.nombre} ${user.apellido}`}</Text>
        <View style={styles.roleContainer}>
          <Icon name="star" size={16} color="#48BB78" />
          <Text style={styles.roleText}>{user.tipo_usuario}</Text>
        </View>

        {/* Información del usuario */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#48BB78" />
            <Text style={styles.infoText}>{user.correo}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#48BB78" />
            <Text style={styles.infoText}>{user.telefono}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#48BB78" />
            <Text style={styles.infoText}>{new Date(user.fecha_creacion).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Botón para volver a la página anterior */}
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={18} color="white" />
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingVertical: '7%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  avatarSection: {
    marginTop: -70,
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#4A5568',
    padding: 8,
    borderRadius: 20,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#48BB78',
    marginTop: 10,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'center',
  },
  roleText: {
    marginLeft: 5,
    color: '#CBD5E0',
    fontSize: 16,
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: '5%',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#A0AEC0',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    width: '50%',
    marginTop: 25,
  },
  backButton: {
    backgroundColor: '#48BB78',
  },
  buttonText: {
    marginLeft: 5,
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});