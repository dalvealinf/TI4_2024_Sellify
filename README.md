

# **📦 Proyecto de Gestión Logística para PYMES**

## **Descripción del Proyecto**
Este proyecto es una aplicación móvil diseñada para facilitar a las PYMES la gestión logística de su inventario, incluyendo **almacenaje, cobro de productos y asignación de precios**. Utiliza la cámara del dispositivo móvil para escanear códigos de barras, lo que permite a los administradores asignar precios, cantidad de productos y otra información esencial. A futuro, se planea implementar una pistola de escaneo de códigos de barras para mejorar la eficiencia y precisión del sistema.

## **Tecnologías Utilizadas**

### **Framework: React Native**
React Native es un framework para el desarrollo de aplicaciones móviles que utiliza JavaScript y React. Permite la creación de aplicaciones nativas para iOS y Android a partir de una única base de código.

- **Documentación:** [React Native Documentation](https://reactnative.dev/docs/getting-started)
- **Instalación**:
  1. **Instalar Node.js y npm**:
     ```bash
     sudo apt-get install nodejs
     sudo apt-get install npm
     ```
  2. **Instalar Expo CLI**:
     ```bash
     npm install -g expo-cli
     ```
  3. **Crear un nuevo proyecto**:
     ```bash
     expo init my-project
     cd my-project
     expo start
     ```

- **Componentes y Librerías**:
  - `react-navigation`: Navegación entre pantallas.
  - `react-native-camera`: Integración de la cámara para escaneo de códigos de barras.
  - `axios`: Para realizar solicitudes HTTP a la API Flask.

### **Base de Datos: MariaDB**
MariaDB es una base de datos relacional de alto rendimiento, derivada de MySQL. Es conocida por su escalabilidad y flexibilidad, y es particularmente adecuada para manejar grandes volúmenes de datos en tiempo real.

- **Documentación:** [MariaDB Documentation](https://mariadb.com/kb/en/documentation/)
- **Instalación**:
  1. **Instalar MariaDB**:
     ```bash
     sudo apt-get update
     sudo apt-get install mariadb-server
     sudo mysql_secure_installation
     ```
  2. **Iniciar y asegurar MariaDB**:
     ```bash
     sudo systemctl start mariadb
     sudo systemctl enable mariadb
     ```

- **Configuración**:
  - Crear una base de datos para la aplicación:
    ```sql
    CREATE DATABASE gestion_logistica;
    ```
  - Crear un usuario y otorgar permisos:
    ```sql
    CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'contraseña';
    GRANT ALL PRIVILEGES ON gestion_logistica.* TO 'usuario'@'localhost';
    FLUSH PRIVILEGES;
    ```

- **Estructura de las tablas**:
  - Tabla de productos:
    ```sql
    CREATE TABLE productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      codigo_barra VARCHAR(255) NOT NULL,
      precio DECIMAL(10, 2) NOT NULL,
      cantidad INT NOT NULL
    );
    ```

### **API: Flask**
Flask es un microframework de Python que se utiliza para desarrollar APIs de manera rápida y sencilla. Es ideal para aplicaciones pequeñas a medianas y proporciona las herramientas necesarias para construir APIs RESTful.

- **Documentación:** [Flask Documentation](https://flask.palletsprojects.com/en/2.0.x/)
- **Instalación**:
  1. **Instalar Flask**:
     ```bash
     pip install Flask
     ```
  2. **Crear una aplicación Flask básica**:
     ```python
     from flask import Flask, request, jsonify

     app = Flask(__name__)

     @app.route('/')
     def hello_world():
         return 'Hello, World!'

     if __name__ == '__main__':
         app.run(debug=True)
     ```

- **Conexión a MariaDB**:
  - Instalar el conector de MariaDB:
    ```bash
    pip install mariadb
    ```
  - Configurar la conexión en Flask:
    ```python
    import mariadb

    conn = mariadb.connect(
      user="usuario",
      password="contraseña",
      host="localhost",
      database="gestion_logistica"
    )

    cursor = conn.cursor()
    ```

- **Rutas y Métodos**:
  - Obtener todos los productos:
    ```python
    @app.route('/productos', methods=['GET'])
    def get_productos():
        cursor.execute("SELECT * FROM productos")
        productos = cursor.fetchall()
        return jsonify(productos)
    ```
  - Añadir un nuevo producto:
    ```python
    @app.route('/productos', methods=['POST'])
    def add_producto():
        data = request.json
        cursor.execute("INSERT INTO productos (nombre, codigo_barra, precio, cantidad) VALUES (?, ?, ?, ?)",
                       (data['nombre'], data['codigo_barra'], data['precio'], data['cantidad']))
        conn.commit()
        return jsonify({"message": "Producto añadido"})
    ```

## **Uso**

### **React Native**
1. **Integrar la cámara**:
   - Utiliza el componente `Camera` de `react-native-camera` para escanear códigos de barras.
   - Maneja los datos escaneados y envía peticiones a la API Flask para obtener o modificar información de productos.

2. **Manejo de solicitudes HTTP**:
   - Utiliza `axios` para realizar peticiones a la API Flask.
   - Ejemplo de una petición GET para obtener todos los productos:
     ```javascript
     import axios from 'axios';

     axios.get('http://<TU_IP>:5000/productos')
       .then(response => {
         console.log(response.data);
       })
       .catch(error => {
         console.error(error);
       });
     ```

### **MariaDB**
1. **Configuración de la base de datos**:
   - Asegúrate de que las tablas necesarias estén creadas y configuradas correctamente.
   - Realiza operaciones CRUD directamente desde la API Flask para mantener los datos actualizados.

### **Flask**
1. **Desarrollo de la API**:
   - Define las rutas necesarias para las operaciones CRUD.
   - Asegura la API mediante autenticación y validación de solicitudes.

2. **Conexión y pruebas**:
   - Verifica que la API esté correctamente conectada a la base de datos.
   - Realiza pruebas de todas las rutas para asegurar que las operaciones funcionen como se espera.

## **Futuras Mejoras**
1. **Integración de escáner de códigos de barras**:
   - Implementar una pistola de escaneo de códigos de barras para mejorar la precisión y eficiencia.
   - Adaptar la aplicación para soportar múltiples métodos de escaneo.

2. **Mejoras en la base de datos**:
   - Optimizar las consultas a la base de datos para manejar grandes volúmenes de datos.
   - Implementar replicación y copias de seguridad para asegurar la integridad de los datos.

3. **Funciones adicionales**:
   - Añadir funcionalidades basadas en las necesidades de las PYMES, como reportes de inventario, alertas de stock bajo, y más.

## **Contribuciones**
Las contribuciones son bienvenidas. Por favor, abre un *pull request* o crea una *issue* si tienes sugerencias o encuentras algún problema.

## **Licencia**
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---
