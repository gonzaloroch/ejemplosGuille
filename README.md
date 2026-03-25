# API de Cursos - Node.js y MySQL

## Descripción
API REST para crear y gestionar cursos usando Node.js, Express y MySQL.

## Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm

## Instalación

### 1. Clonar o descargar el proyecto
```bash
cd ejemplosGuille
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la base de datos MySQL

#### Opción A: Usando SQL
1. Abre MySQL Workbench o accede a MySQL por terminal
2. Ejecuta el archivo `database.sql`:
```sql
-- Copiar y ejecutar el contenido de database.sql
CREATE DATABASE IF NOT EXISTS cursos_db;
USE cursos_db;
CREATE TABLE IF NOT EXISTS cursos (
  idCurso INT AUTO_INCREMENT PRIMARY KEY,
  nombreCurso VARCHAR(255) NOT NULL,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Opción B: Usando el terminal MySQL
```bash
mysql -u root -p < database.sql
```

### 4. Configurar variables de entorno
Edita el archivo `.env` con tus credenciales de MySQL:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tuContraseña
DB_NAME=cursos_db
DB_PORT=3306
PORT=3000
```

### 5. Iniciar el servidor
```bash
npm start
```

O para desarrollo con recarga automática:
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

## Endpoints

### Crear un Curso (POST)
**URL:** `POST http://localhost:3000/api/cursos`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombreCurso": "Python Avanzado"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Curso creado exitosamente",
  "idCurso": 1,
  "nombreCurso": "Python Avanzado"
}
```

**Respuesta Error (400):**
```json
{
  "success": false,
  "message": "El nombre del curso es requerido"
}
```

**Respuesta Error (500):**
```json
{
  "success": false,
  "message": "Error al crear el curso",
  "error": "Error message"
}
```

## Ejemplo de Uso con cURL

```bash
curl -X POST http://localhost:3000/api/cursos \
  -H "Content-Type: application/json" \
  -d '{"nombreCurso": "JavaScript Moderno"}'
```

## Ejemplo de Uso con Postman

1. Abre Postman
2. Crea una nueva solicitud: **POST**
3. URL: `http://localhost:3000/api/cursos`
4. En la pestaña **Headers**, agrega:
   - Key: `Content-Type`
   - Value: `application/json`
5. En la pestaña **Body**, selecciona **raw** y agrega:
```json
{
  "nombreCurso": "React Fundamentals"
}
```
6. Haz clic en **Send**

## Ejemplo de Uso con JavaScript (fetch)

```javascript
fetch('http://localhost:3000/api/cursos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombreCurso: 'Node.js Avanzado'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Curso creado:', data);
    console.log('ID del curso:', data.idCurso);
  })
  .catch(error => console.error('Error:', error));
```

## Estructura del Proyecto

```
ejemplosGuille/
├── server.js              # Punto de entrada de la aplicación
├── db.js                  # Configuración de conexión a MySQL
├── package.json           # Dependencias del proyecto
├── .env                   # Variables de entorno
├── database.sql           # Script SQL para crear BD
├── routes/
│   └── cursos.js          # Rutas y controladores de cursos
└── README.md              # Este archivo
```

## Notas Importantes

- El `idCurso` se genera automáticamente con `AUTO_INCREMENT` en MySQL
- La `fechaCreacion` se registra automáticamente con la fecha/hora actual
- La API valida que `nombreCurso` no esté vacío
- Se utiliza conexión con pool para mejor rendimiento

## Troubleshooting

### Error: "Cannot find module 'express'"
Ejecuta: `npm install`

### Error: "Access denied for user 'root'@'localhost'"
Verifica las credenciales en el archivo `.env`

### Error: "Unknown database 'cursos_db'"
Asegúrate de ejecutar el archivo `database.sql` en MySQL

## Licencia
Este proyecto es de uso educativo y libre.
