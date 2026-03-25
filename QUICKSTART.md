# 🚀 Guía Rápida - API de Cursos

## Inicio Rápido en 5 pasos

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Configurar Base de Datos MySQL
Abre tu cliente MySQL (MySQL Workbench, terminal, etc.) y ejecuta:
```sql
CREATE DATABASE IF NOT EXISTS cursos_db;
USE cursos_db;
CREATE TABLE IF NOT EXISTS cursos (
  idCurso INT AUTO_INCREMENT PRIMARY KEY,
  nombreCurso VARCHAR(255) NOT NULL,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3️⃣ Configurar el Archivo .env
Edita `.env` con tus credenciales MySQL:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tuContraseña
DB_NAME=cursos_db
DB_PORT=3306
PORT=3000
```

### 4️⃣ Iniciar el Servidor
```bash
npm start
```

Verás en la consola:
```
Servidor ejecutándose en http://localhost:3000
Documentación OpenAPI en http://localhost:3000/api-docs
```

### 5️⃣ Acceder a Swagger UI
Abre tu navegador en:
```
http://localhost:3000/api-docs
```

---

## 📖 Documentación en Swagger

En Swagger UI puedes:

✅ **Ver la especificación completa** - Toda la documentación OpenAPI  
✅ **Probar endpoints** - Click en "Try it out"  
✅ **Ver ejemplos** - Request y response ejemplos  
✅ **Validar datos** - Esquemas y validaciones  
✅ **Explorar respuestas** - Ver todos los códigos HTTP (201, 400, 500)  

---

## 📝 Probar el Endpoint POST

### Opción 1: Swagger UI (Recomendado)
1. Ve a `http://localhost:3000/api-docs`
2. Encuentra `POST /api/cursos`
3. Click en "Try it out"
4. En el body ingresa:
```json
{
  "nombreCurso": "Mi Primer Curso"
}
```
5. Click "Execute"

### Opción 2: cURL
```bash
curl -X POST http://localhost:3000/api/cursos \
  -H "Content-Type: application/json" \
  -d '{"nombreCurso": "cURL Test"}'
```

### Opción 3: Postman
- Method: **POST**
- URL: `http://localhost:3000/api-cursos`
- Body (JSON):
```json
{
  "nombreCurso": "Postman Test"
}
```

### Opción 4: JavaScript
```javascript
fetch('http://localhost:3000/api/cursos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombreCurso: 'JavaScript Test' })
})
  .then(r => r.json())
  .then(data => console.log('ID curso:', data.idCurso))
```

---

## ✅ Respuesta Exitosa

```json
{
  "success": true,
  "message": "Curso creado exitosamente",
  "idCurso": 1,
  "nombreCurso": "Mi Primer Curso"
}
```

---

## 🐛 Problemas Comunes

| Problema | Solución |
|----------|----------|
| **Error: Cannot find module** | Ejecuta `npm install` |
| **Error: Access denied MySQL** | Verifica credenciales en `.env` |
| **Error: Unknown database** | Ejecuta el script SQL de creación |
| **Swagger no carga** | Asegura que el servidor está en `http://localhost:3000` |

---

## 📚 Recursos

- 📄 Documentación completa: [README.md](README.md)
- 🔗 Especificación OpenAPI: [openapi.json](openapi.json)
- 🧪 Script de prueba: [test.js](test.js)

---

## 🎯 Próximos Pasos

Después de probar, puedes:
- ✨ Agregar más endpoints (GET, PUT, DELETE)
- 🔒 Implementar autenticación
- 📦 Agregar validaciones avanzadas
- 🚀 Desplegar a producción

¡Disfruta! 🎉
