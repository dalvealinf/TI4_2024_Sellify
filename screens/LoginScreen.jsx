import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Animated, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importación de AsyncStorage

// Obtener correctamente las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [username, setUsername] = useState(''); // Estado para el nombre de usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [error, setError] = useState(null); // Estado para manejar errores
  const [rememberMe, setRememberMe] = useState(false); // Estado para "Recuérdame"
  const navigation = useNavigation(); // Hook para acceder a la navegación

  // Animaciones
  const [cardPosition] = useState(new Animated.Value(height)); // Estado inicial fuera de la pantalla
  const [cardOpacity] = useState(new Animated.Value(0)); // Opacidad inicial
  const [iconScale] = useState(new Animated.Value(0.8)); // Estado inicial de la escala
  const [iconRotation] = useState(new Animated.Value(0)); // Estado inicial de la rotación
  const [inputPosition] = useState(new Animated.Value(-width)); // Deslizamiento desde la izquierda
  const [buttonPosition] = useState(new Animated.Value(height)); // Deslizamiento desde abajo

  useEffect(() => {
    // Función para cargar credenciales guardadas
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

    // Animación de entrada del Card
    Animated.parallel([
      Animated.timing(cardPosition, {
        toValue: 0, // Mover el Card a su posición original
        duration: 800, // Duración de la animación
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1, // Aumentar opacidad a 1
        duration: 800, // Duración de la animación
        useNativeDriver: true,
      }),
    ]).start();

    // Animación del icono
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de los campos de entrada
    Animated.timing(inputPosition, {
      toValue: 0,
      duration: 600,
      delay: 200, // Pequeño retraso para crear el efecto escalonado
      useNativeDriver: true,
    }).start();

    // Animación del botón de ingreso
    Animated.timing(buttonPosition, {
      toValue: 0,
      duration: 600,
      delay: 400, // Pequeño retraso para que el botón aparezca después de los campos
      useNativeDriver: true,
    }).start();
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginPress = async () => {
    // Validar los datos de entrada
    if (username.toLowerCase() === 'admin' && password === '12345') {
      setLoading(true);
      setError(null);
      try {
        if (rememberMe) {
          // Guardar credenciales
          await AsyncStorage.setItem('credentials', JSON.stringify({ username, password }));
        } else {
          // Eliminar credenciales guardadas
          await AsyncStorage.removeItem('credentials');
        }
      } catch (error) {
        console.error('Error al guardar las credenciales', error);
      }
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home'); // Asegúrate de que el nombre coincida exactamente con el nombre de la pantalla en el stack
      }, 2000); // Simulación de 2 segundos
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  // Interpolación para convertir el valor de rotación en grados
  const rotation = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background Decoration */}
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

      {/* Login Card con Animaciones */}
      <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardPosition }] }]}>
        <View style={styles.cardHeader}>
          <Animated.View style={{ transform: [{ scale: iconScale }, { rotate: rotation }] }}>
            <Ionicons name="cube-outline" size={48} color="#5A67D8" />
          </Animated.View>
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>
          <Text style={styles.cardDescription}>
            Accede al sistema de gestión de inventario y ventas
          </Text>
        </View>

        {/* Mostrar mensaje de error */}
        {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

        {/* Campos de entrada con deslizamiento */}
        <Animated.View style={{ transform: [{ translateX: inputPosition }] }}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su nombre de usuario"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateX: inputPosition }] }}>
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
        </Animated.View>

        {/* Checkbox de "Recuérdame" */}
        <Animated.View style={{ transform: [{ translateX: inputPosition }] }}>
          <View style={styles.rememberMeContainer}>
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Ionicons name="checkmark" size={20} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.rememberMeText}>Recuérdame</Text>
          </View>
        </Animated.View>

        {/* Botón de ingreso con animación y carga */}
        <Animated.View style={{ transform: [{ translateY: buttonPosition }] }}>
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
    borderRadius: 1000,  // Lo suficientemente grande para ser un círculo
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
});
