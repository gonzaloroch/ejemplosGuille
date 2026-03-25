const express = require('express');
const pool = require('../db');
const router = express.Router();

// POST - Crear un nuevo curso
router.post('/', async (req, res) => {
  try {
    const { nombreCurso } = req.body;

    // Validar que nombreCurso no esté vacío
    if (!nombreCurso || nombreCurso.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del curso es requerido'
      });
    }

    // Insertar en la base de datos
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO cursos (nombreCurso) VALUES (?)',
      [nombreCurso]
    );
    
    connection.release();

    // Retornar el ID del curso creado
    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      idCurso: result.insertId,
      nombreCurso: nombreCurso
    });

  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el curso',
      error: error.message
    });
  }
});

module.exports = router;
