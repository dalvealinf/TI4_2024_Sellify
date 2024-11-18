import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Switch } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditUserScreen() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { userRut } = route.params; // RUT por parte de GestionUsuarios

  useEffect(() => {
    // Obtener los datos actuales del usuario desde la API utilizando el RUT
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://170.239.85.88:5000/users/${userRut}`);
        const userData = await response.json();
        setInitialData(userData);

        // Rellenar los campos con los datos actuales del usuario
        setName(userData.nombre);
        setLastName(userData.apellido);
        setEmail(userData.correo);
        setPhone(userData.telefono);
        setRole(userData.tipo_usuario);
        setIsActive(userData.estado === 'activo');
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
      }
    };

    fetchUserData();
  }, [userRut]);

  // Función para manejar la actualización del usuario
  const handleUpdateUser = async () => {
    setLoading(true);

    // Crear un objeto con solo los datos modificados
    const updatedData = {};
    if (name !== initialData.nombre) updatedData.nombre = name;
    if (lastName !== initialData.apellido) updatedData.apellido = lastName;
    if (email !== initialData.correo) updatedData.correo = email;
    if (phone !== initialData.telefono) updatedData.telefono = phone;
    if (password) updatedData.contrasena = password;
    if (role !== initialData.tipo_usuario) updatedData.tipo_usuario = role; // Comprobar si el rol ha cambiado
    if (isActive !== (initialData.estado === 'activo')) updatedData.estado = isActive ? 'activo' : 'inactivo';

    if (Object.keys(updatedData).length === 0) {
      Alert.alert('Sin cambios', 'No se han hecho cambios para actualizar.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://170.239.85.88:5000/users/${userRut}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        Alert.alert('Actualización exitosa', 'El usuario ha sido actualizado.');
        navigation.goBack(); // Volver a la pantalla anterior
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.msg || 'Ocurrió un error al actualizar el usuario.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Editar Usuario</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.loadingText}>Guardando cambios...</Text>
          </View>
        ) : (
          <>
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
              <Icon name="mail" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
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
              <TouchableOpacity
                style={[styles.roleButton, role === 'cliente' ? styles.activeRoleButton : null]}
                onPress={() => setRole('cliente')}
              >
                <Text style={[styles.roleText, role === 'cliente' ? styles.activeRoleText : null]}>Cliente</Text>
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

            <TouchableOpacity onPress={handleUpdateUser} style={styles.updateButton}>
              <View style={styles.updateButtonBackground}>
                <Icon name="save" size={20} color="white" />
                <Text style={styles.updateButtonText}>Guardar Cambios</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1A2238',
  },
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
  headerText: {
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
    justifyContent: 'center',
    minWidth: 100,
  },
  activeRoleButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  roleText: {
    color: '#fff',
    fontSize: 13, // Tamaño del texto del globo de tipo de usuario
    textAlign: 'center',
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
  updateButton: {
    marginTop: 20,
  },
  updateButtonBackground: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
  },
  updateButtonText: {
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

