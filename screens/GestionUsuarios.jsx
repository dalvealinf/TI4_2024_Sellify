import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; 
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', avatar: require('../assets/avatar.jpg') },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', avatar: require('../assets/avatar.jpg') },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', avatar: require('../assets/avatar.jpg') },
  { id: 4, name: 'Diana Ross', email: 'diana@example.com', role: 'User', avatar: require('../assets/avatar.jpg') },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'Admin', avatar: require('../assets/avatar.jpg') },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null); 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation(); // Hook para manejar la navegación

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Flecha de retroceso y Encabezado de la página */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')} // Navegar a Home al presionar la flecha
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.header}>Gestión de Usuarios</Text>
        </Animated.View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar usuarios..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="user-plus" size={20} color="white" />
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Image
                source={user.avatar}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.userActions}>
              <Text style={styles.roleBadge}>{user.role}</Text>

              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => setMenuVisible(menuVisible === user.id ? null : user.id)}
              >
                <Icon name="more-vertical" size={20} color="white" />
              </TouchableOpacity>

              {menuVisible === user.id && (
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
                onPress={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                style={styles.expandButton}
              >
                <Icon name="chevron-down" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {expandedUser === user.id && (
              <View style={styles.additionalInfo}>
                <Text style={styles.additionalText}>Rol: {user.role}</Text>
                <Text style={styles.additionalText}>Último acceso: Hace 2 días</Text>
                <Text style={styles.additionalText}>Estado de la cuenta: Activo</Text>
                <Text style={styles.additionalText}>Ventas realizadas: $3.421.221</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2c2c2c',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#444',
    paddingHorizontal: 12,
    borderRadius: 8,
    color: 'white',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
  },
  userCard: {
    backgroundColor: '#3d3d3d',
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
    backgroundColor: '#555',
    padding: 8,
    borderRadius: 8,
  },
  expandButton: {
    backgroundColor: '#555',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  additionalInfo: {
    marginTop: 12,
    backgroundColor: '#444',
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
});
