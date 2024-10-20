import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Provider, Menu, Divider } from 'react-native-paper';

export default function InactiveUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const navigation = useNavigation();

  const fetchInactiveUsersFromAPI = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('http://170.239.85.88:5000/users');
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      
      // Filtrar solo los usuarios con estado "inactivo"
      const inactiveUsers = data.filter(user => user.estado && user.estado.toLowerCase() === 'inactivo');
      setUsers(inactiveUsers);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveUsersFromAPI();
  }, []);

  const handleActivateUser = async (rut) => {
    Alert.alert(
      'Confirmar activación',
      '¿Estás seguro de que deseas activar a este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, activar',
          onPress: async () => {
            try {
                // Ruta temporal
              const response = await fetch(`http://170.239.85.88:5000/users/${rut}/activate`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (response.ok) {
                Alert.alert('Usuario activado', 'El usuario ha sido activado exitosamente.');
                // Refrescar la lista de usuarios después de la activación
                fetchInactiveUsersFromAPI();
              } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Ocurrió un error al activar al usuario.');
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo activar al usuario. Inténtalo nuevamente.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.header}>Usuarios Inactivos</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.loadingText}>Cargando usuarios inactivos...</Text>
          </View>
        ) : error ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.errorText}>No se pudo acceder al servidor web.</Text>
          </View>
        ) : (
          <ScrollView>
            {users.map((user) => (
              <View key={user.id_usuario} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Icon name="user" size={20} color="white" style={styles.userIcon} />
                  <View>
                    <Text style={styles.userName}>{`${user.nombre} ${user.apellido}`}</Text>
                    <Text style={styles.userEmail}>{user.correo}</Text>
                  </View>
                </View>

                <View style={styles.userActions}>
                  <Menu
                    visible={menuVisible === user.id_usuario}
                    onDismiss={() => setMenuVisible(null)}
                    anchor={
                      <TouchableOpacity
                        onPress={() => setMenuVisible(menuVisible === user.id_usuario ? null : user.id_usuario)}
                        style={styles.moreButton}
                      >
                        <Icon name="more-vertical" size={20} color="white" />
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item 
                      onPress={() => handleActivateUser(user.rut)} 
                      title="Activar" 
                    />
                  </Menu>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1A2238',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  userCard: {
    backgroundColor: '#2D3A59',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    marginRight: 12,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#aaa',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  moreButton: {
    backgroundColor: '#1A73E8',
    padding: 8,
    borderRadius: 8,
  },
});
