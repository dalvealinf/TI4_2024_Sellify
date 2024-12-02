import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Menu, Divider, Provider } from 'react-native-paper';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [userToDeactivate, setUserToDeactivate] = useState(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Llamada a la API
  const fetchUsersFromAPI = async () => {
    setLoading(true); // Mostrar el indicador de carga
    setError(false); // Reiniciar el estado de error
    try {
      const response = await fetch('http://170.239.85.88:5000/users');
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(true); // Indicar que hubo un error
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  // useFocusEffect se ejecuta cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      // Cerrar el menú cuando la pantalla vuelva a estar en foco
      setMenuVisible(null);
      // Cuando la pantalla esté en foco, hacer la solicitud a la API
      fetchUsersFromAPI();
    }, [])
  );

  const filteredUsers = users.filter(user => {
    const searchWords = searchTerm.trim().toLowerCase().split(' ');
    const fullName = `${user.nombre.toLowerCase()} ${user.apellido.toLowerCase()}`;
    return searchWords.every(word => 
      fullName.includes(word) || 
      user.correo.toLowerCase().includes(word)
    );
  });

  const handleEditUser = (rut) => {
    if (!rut) {
      Alert.alert('Error', 'No se pudo obtener el RUT del usuario.');
      return;
    }
    // Navegar a la pantalla de edición del usuario
    navigation.navigate('EditUser', { userRut: rut }); // Asegúrate de enviar 'userRut' como prop a la ruta de edición
  };

  const handleDeactivateUser = async (rut, estadoActual) => {
    if (estadoActual === 'inactivo') {
      setModalMessage('Este usuario ya está inactivo.');
      setErrorModalVisible(true);
      return;
    }
    
    setUserToDeactivate(rut);
    setConfirmModalVisible(true);
  };

  const confirmDeactivation = async () => {
    try {
      const response = await fetch(`http://170.239.85.88:5000/users/${userToDeactivate}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setModalMessage('El usuario ha sido desactivado exitosamente.');
        fetchUsersFromAPI();
      } else {
        const errorData = await response.json();
        setModalMessage(errorData.message || 'Ocurrió un error al desactivar al usuario.');
        setErrorModalVisible(true);
      }
    } catch (error) {
      setModalMessage('No se pudo desactivar al usuario. Inténtalo nuevamente.');
      setErrorModalVisible(true);
    }
    setConfirmModalVisible(false);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.header}>Gestión de Usuarios</Text>
          </Animated.View>
          {/* Botón para ver usuarios inactivos */}
  <TouchableOpacity 
    style={styles.inactiveButton}
    onPress={() => navigation.navigate('InactiveUsers')} // Navegar a la nueva pantalla
  >
    <Icon name="user-x" size={24} color="white" />
  </TouchableOpacity>
        </View>

        {/* Cuadro de búsqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Buscar usuarios..."
              placeholderTextColor="#888"
              value={searchTerm}
              onChangeText={(text) => setSearchTerm(text)}
            />
          </View>

          {/* Redirección al añadir usuario */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddUser')}
          >
            <Icon name="user-plus" size={20} />
            <Text style={styles.addButtonText}>Añadir</Text>
          </TouchableOpacity>
        </View>

        {/* Mostrar el indicador de carga */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.loadingText}>Cargando usuarios...</Text>
          </View>
        ) : error ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.errorText}>No se pudo acceder al servidor web.</Text>
          </View>
        ) : (
          <ScrollView>
            {filteredUsers.map((user) => (
              <View key={user.id_usuario} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Image
                    source={require('../assets/avatar.jpg')} // Usa una imagen por defecto
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.userName}>{`${user.nombre} ${user.apellido}`}</Text>
                    <Text style={styles.userEmail}>{user.correo}</Text>
                  </View>
                </View>

                <View style={styles.userActions}>
                  <Text style={styles.roleBadge}>{user.tipo_usuario}</Text>

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
                      onPress={() => handleEditUser(user.rut)} 
                      title="Editar" 
                    />
                    <Divider />
                    <Menu.Item 
  onPress={() => handleDeactivateUser(user.rut, user.estado)} 
  title="Dejar Inactivo" 
/>
                  </Menu>

                  <TouchableOpacity
                    onPress={() => setExpandedUser(expandedUser === user.id_usuario ? null : user.id_usuario)}
                    style={styles.expandButton}
                  >
                    <Icon name="chevron-down" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {expandedUser === user.id_usuario && (
                  <View style={styles.additionalInfo}>
                    <Text style={styles.additionalText}>Correo: {user.correo}</Text>
                    <Text style={styles.additionalText}>Teléfono: {user.telefono}</Text>
                    <Text style={styles.additionalText}>RUT: {user.rut}</Text>
                    <Text style={styles.additionalText}>Estado: {user.estado}</Text>
                    <Text style={styles.additionalText}>Puntos: {user.puntos}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Icon name="alert-triangle" size={60} color="#FF6B6B" />
            <Text style={styles.modalTitle}>Confirmar desactivación</Text>
            <Text style={styles.modalMessage}>¿Estás seguro de que deseas desactivar a este usuario?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDeactivation}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
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
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity 
              style={[styles.modalButton, styles.errorButton]}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginHorizontal: 5,
  },
  backButton: {
    marginLeft: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3A59',
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#3BCEAC',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#1A2238',
    marginLeft: 8,
  },
  userCard: {
    backgroundColor: '#2D3A59',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  roleBadge: {
    backgroundColor: '#007bff',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    marginRight: 'auto',
  },
  moreButton: {
    backgroundColor: '#1A73E8',
    padding: 8,
    borderRadius: 8,
  },
  expandButton: {
    backgroundColor: '#1A73E8',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  additionalInfo: {
    marginTop: 12,
    backgroundColor: '#1E2A38',
    padding: 12,
    borderRadius: 8,
  },
  additionalText: {
    color: '#ccc',
    marginBottom: 4,
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
  inactiveButton: {
    marginLeft: 'auto',
    marginRight: 10,
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: '45%',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButton: {
    backgroundColor: '#3BCEAC',
  },
  errorButton: {
    backgroundColor: '#FF6B6B',
    minWidth: '100%',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
