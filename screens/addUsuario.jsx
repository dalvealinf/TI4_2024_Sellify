import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Switch } from 'react-native-paper';  // Usamos react-native-paper para el Switch

export default function AddUserScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');  // Estado para el rol
  const [isActive, setIsActive] = useState(true);  // Estado para el Switch de "Usuario Activo"
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal de confirmación

  const handleAddUser = () => {
    // Verificar si todos los campos están completos antes de mostrar el modal
    if (name && email && password) {
      setModalVisible(true);
    } else {
      alert('Por favor, rellena todos los campos.');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    // Navegar de vuelta después de cerrar el modal
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Modal de confirmación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Icon name="check-circle" size={60} color="#4caf50" />
            <Text style={styles.modalTitle}>¡Usuario Creado!</Text>
            <Text style={styles.modalMessage}>El nuevo usuario ha sido agregado correctamente.</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        {/* Flecha de retroceso */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        
        {/* Título */}
        <Text style={styles.backButtonText}>Gestión de Usuarios</Text>
      </View>

      {/* Inputs de Nombre, Email y Contraseña */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#fff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} color="#fff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#fff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Selección de Rol */}
      <Text style={styles.roleLabel}>Rol</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'user' ? styles.activeRoleButton : null]}
          onPress={() => setRole('user')}
        >
          <Text style={[styles.roleText, role === 'user' ? styles.activeRoleText : null]}>Vendedor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'admin' ? styles.activeRoleButton : null]}
          onPress={() => setRole('admin')}
        >
          <Text style={[styles.roleText, role === 'admin' ? styles.activeRoleText : null]}>Administrador</Text>
        </TouchableOpacity>
      </View>

      {/* Switch de Usuario Activo */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Usuario Activo</Text>
        <Switch
          value={isActive}
          onValueChange={() => setIsActive(!isActive)}
          color="#FF6B6B"
        />
      </View>

      {/* Botón de Crear Usuario */}
      <TouchableOpacity onPress={handleAddUser} style={styles.addButton}>
        <View style={styles.addButtonBackground}>
          <Icon name="user-plus" size={20} color="white" />
          <Text style={styles.addButtonText}>Crear Usuario</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#1A2238',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3A59',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  backButton: {
    paddingRight: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    paddingLeft: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: 'white',
    fontSize: 16,
  },
  roleLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeRoleButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
  },
  activeRoleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2D3A59',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  switchLabel: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    marginTop: 20,
  },
  addButtonBackground: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo translúcido
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
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
  closeButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
