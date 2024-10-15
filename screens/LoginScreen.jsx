import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Animated, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem('credentials');
        if (savedCredentials) {
          const { username, password } = JSON.parse(savedCredentials);
          setUsername(username);
          setPassword(password);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error al cargar las credenciales', error);
      }
    };

    loadCredentials();
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginPress = async () => {
    setLoading(true);
    setError(null);

    if (!username || !password) {
      setError("Por favor, ingrese su RUT y contraseña.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://170.239.85.88:5000/login', {  // Usa tu IP local aquí
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut: username, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          await AsyncStorage.setItem('credentials', JSON.stringify({ username, password }));
        } else {
          await AsyncStorage.removeItem('credentials');
        }

        await AsyncStorage.setItem('token', data.access_token);
        navigation.navigate('Home');
      } else {
        setError(data.msg || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error al conectar con el servidor. Verifique la red.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <LinearGradient
        colors={['#6B46C1', '#ECC94B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.circle, styles.circle1, { width: width * 1.2, height: width * 1.2 }]}
      />
      <LinearGradient
        colors={['#ECC94B', '#F687B3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.circle, styles.circle2, { width: width * 1, height: width * 1 }]}
      />
      <LinearGradient
        colors={['#F687B3', '#6B46C1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.circle, styles.circle3, { width: width * 0.8, height: width * 0.8 }]}
      />
      <LinearGradient
        colors={['#6B46C1', '#ECC94B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.circle, styles.circle4, { width: width * 0.9, height: width * 0.9 }]}
      />
      
      <Animated.View style={[styles.card, { opacity: 1, transform: [{ translateY: 0 }] }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="cube-outline" size={48} color="#5A67D8" />
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>
          <Text style={styles.cardDescription}>Accede al sistema de gestión de inventario y ventas</Text>
        </View>

        {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre de usuario"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su contraseña"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rememberMeContainer}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Ionicons name="checkmark" size={20} color="#fff" />}
          </TouchableOpacity>
          <Text style={styles.rememberMeText}>Recuérdame</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress} disabled={loading}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loginButtonText}>Ingresando...</Text>
            </View>
          ) : (
            <Text style={styles.loginButtonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f0f4f8',
    position: 'relative',
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,  
    opacity: 0.7,
  },
  circle1: {
    top: -height * 0.3,
    left: -width * 0.2,
  },
  circle2: {
    bottom: -height * 0.2,
    right: -width * 0.3,
  },
  circle3: {
    top: height * 0.5,
    left: -width * 0.4,
  },
  circle4: {
    bottom: -height * 0.4,
    right: -width * 0.2,
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,  // Asegúrate de que la tarjeta esté sobre los círculos
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    width: 270,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  checkboxChecked: {
    backgroundColor: '#5A67D8',
    borderColor: '#5A67D8',
  },
  rememberMeText: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#5A67D8',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> dev
