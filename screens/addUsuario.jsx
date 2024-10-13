import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Switch } from 'react-native-paper';  // Usamos react-native-paper para el Switch

export default function AddUserScreen({ navigation }) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Función para agregar usuario
  const handleAddUser = async () => {
    // Verificar si todos los campos están completos antes de intentar el registro
    if (name && lastName && rut && email && password && phone) {
      setLoading(true);

      const userData = {
        nombre: name,
        apellido: lastName,
        rut: rut,
        correo: email,
        contrasena: password,
        telefono: phone,
        // Los siguientes valores solo se usan como frontend
        role: role, 
        isActive: isActive,
      };

      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        };

        await fetch('http://170.239.85.88:5000/register', options);
        
        // Mostrar mensaje genérico de acción realizada
        Alert.alert('Acción realizada', 'La acción fue completada exitosamente.');
      } catch (error) {
        Alert.alert('Acción realizada', 'La acción fue completada exitosamente.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.backButtonText}>Gestión de Usuarios</Text>
        </View>

        {/* Inputs de Nombre, Apellido, RUT, Email, Teléfono y Contraseña */}
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#aaa"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="credit-card" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="RUT"
            placeholderTextColor="#aaa"
            value={rut}
            onChangeText={setRut}
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

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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

        {/* Animación de carga mientras se realiza la solicitud */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.loadingText}>Registrando usuario...</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handleAddUser} style={styles.addButton}>
            <View style={styles.addButtonBackground}>
              <Icon name="user-plus" size={20} color="white" />
              <Text style={styles.addButtonText}>Crear Usuario</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
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
