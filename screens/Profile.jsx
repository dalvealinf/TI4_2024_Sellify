import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({
    name: "María García",
    email: "maria.garcia@ejemplo.com",
    role: "Gerente de Proyecto",
    avatarUrl: "https://via.placeholder.com/100", // Enlace de avatar placeholder
    isOnline: true,
    lastLogin: "2023-10-15T14:30:00Z",
  });

  const handleLogout = () => {
    // Implementar lógica de cierre de sesión aquí
    Alert.alert("Cierre de sesión", "Has cerrado la sesión exitosamente", [
      { text: "OK", onPress: () => navigation.replace('Login') }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Correo:</Text>
          <Text style={styles.infoText}>{user.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado:</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: user.isOnline ? 'green' : 'gray' }]} />
            <Text style={styles.infoText}>{user.isOnline ? 'En línea' : 'Desconectado'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Último acceso:</Text>
          <Text style={styles.infoText}>{new Date(user.lastLogin).toLocaleString()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#FFFFFF" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 20,
    marginTop: 150, // Ajusta esta propiedad para bajar el contenido manualmente
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    color: '#777',
  },
  moreButton: {
    padding: 10,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoText: {
    color: '#777',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
