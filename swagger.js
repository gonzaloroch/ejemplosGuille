const swaggerJsdoc = require('swagger-jsdoc');

const options = {
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
        url: 'http://localhost:3000',
        description: 'Servidor Local de Desarrollo'
      },
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Pruebas'
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
        },
        CursoRequest: {
          type: 'object',
          required: ['nombreCurso'],
          properties: {
            nombreCurso: {
              type: 'string',
              description: 'Nombre del curso a crear',
              minLength: 1,
              maxLength: 255,
              example: 'JavaScript Moderno'
            }
          }
        },
        CursoResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa',
              example: true
            },
            message: {
              type: 'string',
              description: 'Mensaje descriptivo de la operación',
              example: 'Curso creado exitosamente'
            },
            idCurso: {
              type: 'integer',
              format: 'int64',
              description: 'ID del curso creado',
              example: 1
            },
            nombreCurso: {
              type: 'string',
              description: 'Nombre del curso creado',
              example: 'JavaScript Moderno'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error al crear el curso'
            },
            error: {
              type: 'string',
              description: 'Detalles del error'
            }
          }
        }
      }
    }
  },
  apis: []
};

const specs = swaggerJsdoc(options);

module.exports = specs;
