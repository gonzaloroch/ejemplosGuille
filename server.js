const express = require('express');
require('dotenv').config();
const cursosRouter = require('./routes/cursos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/cursos', cursosRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Cursos',
    version: '1.0.0',
    endpoints: {
      POST: '/api/cursos - Crear un nuevo curso'
    }
  });
});

// Manicultura de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
