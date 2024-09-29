import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Obtener datos de la API
    fetchUsersFromAPI();
  }, [fadeAnim]);

  // Función para hacer la solicitud a la API con reintentos
  const fetchWithRetry = async (url, options = {}, retries = 50, delay = 500) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Error en la solicitud');
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.log(`Reintentando... ${retries} intentos restantes`);
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(url, options, retries - 1, delay);
      } else {
        throw error;
      }
    }
  };

  // Llamada a la API
  const fetchUsersFromAPI = async () => {
    setLoading(true); // Mostrar el indicador de carga desde el inicio del proceso
    try {
      const data = await fetchWithRetry('http://170.239.85.88:5000/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'No se pudieron obtener los usuarios. Verifica tu conexión.');
    } finally {
      setLoading(false); // Ocultar el indicador de carga cuando se terminen los intentos
    }
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.header}>Gestión de Usuarios</Text>
        </Animated.View>
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
                <Text style={styles.roleBadge}>Usuario</Text>

                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => setMenuVisible(menuVisible === user.id_usuario ? null : user.id_usuario)}
                >
                  <Icon name="more-vertical" size={20} color="white" />
                </TouchableOpacity>

                {menuVisible === user.id_usuario && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity style={styles.menuItem}>
                      <Icon name="edit" size={16} color="white" />
                      <Text style={styles.menuText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                      <Icon name="trash" size={16} color="white" />
                      <Text style={styles.menuText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}

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
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
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
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuText: {
    color: 'white',
    marginLeft: 8,
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
});
