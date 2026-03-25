const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cursosRouter = require('./routes/cursos');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Cursos',
      version: '1.0.0',
      description: 'API REST para crear y gestionar cursos usando Node.js, Express y MySQL',
      contact: {
        name: 'Soporte API',
        email: 'support@ejemplo.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor Local de Desarrollo'
      }
    ],
    components: {
      schemas: {
        Curso: {
          type: 'object',
          required: ['nombreCurso'],
          properties: {
            idCurso: {
              type: 'integer',
              format: 'int64',
              description: 'ID único del curso (generado automáticamente)',
              example: 1
            },
            nombreCurso: {
              type: 'string',
              description: 'Nombre del curso',
              example: 'Python Avanzado'
            },
            fechaCreacion: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de creación del curso',
              example: '2026-03-25T10:30:00.000Z'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Cursos - Documentación'
}));

// Rutas
app.use('/api/cursos', cursosRouter);

// Ruta de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejador de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Documentación OpenAPI en http://localhost:${PORT}/api-docs`);
});
