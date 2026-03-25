# 📋 Especificación OpenAPI - Detalles

## ¿Qué es OpenAPI?

OpenAPI es un estándar abierto para describir APIs REST. Permite:
- 📖 Documentación automática e interactiva
- 🧪 Testing de endpoints sin herramientas externas
- 🔄 Generación de código cliente
- 📝 Validación de contratos API

---

## 📊 Estructura de la Especificación

### Versión y Metadatos
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "API de Cursos",
    "version": "1.0.0",
    "description": "...",
    "contact": { "name": "...", "email": "..." },
    "license": { "name": "MIT" }
  }
}
```

### Servidores
Define dónde se ejecuta la API:
```json
"servers": [
  {
    "url": "http://localhost:3000",
    "description": "Desarrollo local"
  }
]
```

### Paths (Endpoints)
Documentación completa de cada endpoint:
```json
"paths": {
  "/api/cursos": {
    "post": {
      "summary": "Crear un nuevo curso",
      "description": "Crea un curso...",
      "tags": ["Cursos"],
      "requestBody": { ... },
      "responses": { ... }
    }
  }
}
```

---

## 🔍 Endpoint POST /api/cursos - Detalles Documentados

### Request Body
```json
{
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "required": ["nombreCurso"],
          "properties": {
            "nombreCurso": {
              "type": "string",
              "minLength": 1,
              "maxLength": 255,
              "description": "Nombre del curso"
            }
          }
        },
        "examples": {
          "ejemplo1": {
            "summary": "Crear curso de programación",
            "value": { "nombreCurso": "Python Avanzado" }
          }
        }
      }
    }
  }
}
```

### Respuestas (Responses)

#### Código 201 - Éxito
```json
{
  "201": {
    "description": "Curso creado exitosamente",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "success": { "type": "boolean" },
            "message": { "type": "string" },
            "idCurso": { "type": "integer" },
            "nombreCurso": { "type": "string" }
          }
        }
      }
    }
  }
}
```

#### Código 400 - Validación
```json
{
  "400": {
    "description": "Error: campo requerido faltante",
    "content": {
      "application/json": {
        "examples": {
          "error": {
            "value": {
              "success": false,
              "message": "El nombre del curso es requerido"
            }
          }
        }
      }
    }
  }
}
```

#### Código 500 - Error Servidor
```json
{
  "500": {
    "description": "Error interno del servidor",
    "content": {
      "application/json": {
        "examples": {
          "error": {
            "value": {
              "success": false,
              "message": "Error al crear el curso",
              "error": "Connection refused"
            }
          }
        }
      }
    }
  }
}
```

---

## 🔗 Componentes Reutilizables

### Schemas
Definiciones de estructuras de datos que se pueden reutilizar:

```json
"components": {
  "schemas": {
    "Curso": {
      "type": "object",
      "properties": {
        "idCurso": { "type": "integer" },
        "nombreCurso": { "type": "string" },
        "fechaCreacion": { "type": "string", "format": "date-time" }
      }
    },
    "ErrorResponse": {
      "type": "object",
      "properties": {
        "success": { "type": "boolean" },
        "message": { "type": "string" }
      }
    }
  }
}
```

---

## 📁 Contenido de los Archivos

### `server.js`
- Configura la especificación OpenAPI
- Integra Swagger UI en la ruta `/api-docs`
- Define servidores, esquemas y rutas

### `routes/cursos.js`
- Contiene comentarios JSDoc con `@swagger` tags
- Swagger-JSDoc extrae estos comentarios y genera la especificación

### `openapi.json`
- Especificación OpenAPI completa en formato JSON
- Puede usarse en otras herramientas que soporten OpenAPI

### `swagger.js`
- Configuración alternativa de Swagger (opcional)

---

## 🗂️ Validaciones Documentadas

En la especificación OpenAPI se definen:

| Validación | Valor | Descripción |
|-----------|-------|-------------|
| `required` | `["nombreCurso"]` | Campo obligatorio |
| `minLength` | `1` | Mínimo 1 carácter |
| `maxLength` | `255` | Máximo 255 caracteres |
| `type` | `"string"` | Tipo de dato string |

---

## 🎯 Beneficios de OpenAPI

✅ **Documentación Automática** - Se genera del código  
✅ **Interfaz Interactiva** - Swagger UI integrada  
✅ **Prueba de Endpoints** - Try-it-out en el navegador  
✅ **Validación de Tipos** - Schema validation  
✅ **Ejemplos Múltiples** - Diferentes casos de uso  
✅ **Información HTTP** - Status codes documentados  

---

## 🚀 Cómo Usar la Especificación

### Opción 1: Swagger UI (Recomendado)
```
http://localhost:3000/api-docs
```
Interfaz web interactiva y amigable.

### Opción 2: Herramientas OpenAPI
Puedes validar/usar la especificación con:
- 🔗 [Swagger Editor](https://editor.swagger.io)
- 🔗 [Postman](https://www.postman.com)
- 🔗 [Insomnia](https://insomnia.rest)
- 🔗 [ReDoc](https://redoc.ly)

### Opción 3: JSON Raw
Accede al JSON en:
```
http://localhost:3000/swagger.json
```

---

## 📚 Referencias

- [OpenAPI 3.0.0 Spec](https://spec.openapis.org/oas/v3.0.0)
- [Swagger Documentation](https://swagger.io/docs)
- [JSON Schema](https://json-schema.org)
