const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Obtener lista de todos los cursos
 *     description: Devuelve una lista completa de todos los cursos registrados en la base de datos
 *     tags:
 *       - Cursos
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cursos obtenidos exitosamente
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 cursos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idCurso:
 *                         type: integer
 *                         example: 1
 *                       nombreCurso:
 *                         type: string
 *                         example: Python Avanzado
 *                       fechaCreacion:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-03-25T10:30:00.000Z
 *             examples:
 *               exitoso:
 *                 summary: Respuesta con cursos
 *                 value:
 *                   success: true
 *                   message: Cursos obtenidos exitosamente
 *                   total: 2
 *                   cursos:
 *                     - idCurso: 1
 *                       nombreCurso: Python Avanzado
 *                       fechaCreacion: 2026-03-25T10:30:00.000Z
 *                     - idCurso: 2
 *                       nombreCurso: JavaScript Moderno
 *                       fechaCreacion: 2026-03-25T11:00:00.000Z
 *               vacio:
 *                 summary: Respuesta sin cursos
 *                 value:
 *                   success: true
 *                   message: Cursos obtenidos exitosamente
 *                   total: 0
 *                   cursos: []
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al obtener cursos
 *                 error:
 *                   type: string
 *                   example: Connection refused
 */
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    let cursos;

    try {
      [cursos] = await connection.execute(
        'SELECT idCurso, nombreCurso, fechaDesde, fechaHasta, fechaCreacion FROM curso ORDER BY idCurso DESC'
      );
    } catch (queryError) {
      if (queryError.code !== 'ER_BAD_FIELD_ERROR') {
        throw queryError;
      }

      try {
        [cursos] = await connection.execute(
          'SELECT idCurso, nombreCurso, fechaInicio, fechaFinalizacion, fechaCreacion FROM curso ORDER BY idCurso DESC'
        );
      } catch (legacyQueryError) {
        if (legacyQueryError.code !== 'ER_BAD_FIELD_ERROR') {
          throw legacyQueryError;
        }

        const [cursosSinFechas] = await connection.execute(
          'SELECT idCurso, nombreCurso, fechaCreacion FROM curso ORDER BY idCurso DESC'
        );
        cursos = cursosSinFechas.map((curso) => ({
          ...curso,
          fechaDesde: null,
          fechaHasta: null
        }));
      }
    }

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Cursos obtenidos exitosamente',
      total: cursos.length,
      cursos: cursos
    });

  } catch (error) {
    console.error('Error al obtener cursos:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cursos',
      error: error.message,
      details: error.code || 'Error desconocido'
    });
  }
});

/**
 * @swagger
 * /api/cursos/{idCurso}:
 *   get:
 *     summary: Obtener un curso por ID
 *     description: Devuelve los detalles de un curso específico por su ID
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: idCurso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso a obtener
 *         example: 1
 *     responses:
 *       200:
 *         description: Curso encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Curso obtenido exitosamente
 *                 curso:
 *                   type: object
 *                   properties:
 *                     idCurso:
 *                       type: integer
 *                       example: 1
 *                     nombreCurso:
 *                       type: string
 *                       example: Python Avanzado
 *                     fechaCreacion:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-03-25T10:30:00.000Z
 *       404:
 *         description: Curso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:idCurso', async (req, res) => {
  try {
    const { idCurso } = req.params;

    if (!idCurso || isNaN(idCurso)) {
      return res.status(400).json({
        success: false,
        message: 'El ID del curso es inválido'
      });
    }

    const connection = await pool.getConnection();
    let curso;

    try {
      [curso] = await connection.execute(
        'SELECT idCurso, nombreCurso, fechaDesde, fechaHasta, fechaCreacion FROM curso WHERE idCurso = ?',
        [idCurso]
      );
    } catch (queryError) {
      if (queryError.code !== 'ER_BAD_FIELD_ERROR') {
        throw queryError;
      }

      try {
        [curso] = await connection.execute(
          'SELECT idCurso, nombreCurso, fechaInicio, fechaFinalizacion, fechaCreacion FROM curso WHERE idCurso = ?',
          [idCurso]
        );
      } catch (legacyQueryError) {
        if (legacyQueryError.code !== 'ER_BAD_FIELD_ERROR') {
          throw legacyQueryError;
        }

        const [cursoSinFechas] = await connection.execute(
          'SELECT idCurso, nombreCurso, fechaCreacion FROM curso WHERE idCurso = ?',
          [idCurso]
        );
        curso = cursoSinFechas.map((item) => ({
          ...item,
          fechaDesde: null,
          fechaHasta: null
        }));
      }
    }

    connection.release();

    if (curso.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Curso obtenido exitosamente',
      curso: curso[0]
    });

  } catch (error) {
    console.error('Error al obtener curso:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el curso',
      error: error.message,
      details: error.code || 'Error desconocido'
    });
  }
});

/**
 * @swagger
 * /api/cursos/{idCurso}:
 *   put:
 *     summary: Editar un curso por ID
 *     description: Actualiza el nombre de un curso existente por su ID
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: idCurso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso a editar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCurso
 *             properties:
 *               nombreCurso:
 *                 type: string
 *                 description: Nuevo nombre del curso
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: Python Expert
 *           examples:
 *             ejemplo1:
 *               summary: Editar nombre de curso
 *               value:
 *                 nombreCurso: "Python Expert"
 *     responses:
 *       200:
 *         description: Curso actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Curso actualizado exitosamente
 *                 curso:
 *                   type: object
 *                   properties:
 *                     idCurso:
 *                       type: integer
 *                       example: 1
 *                     nombreCurso:
 *                       type: string
 *                       example: Python Expert
 *                     fechaCreacion:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validación - campo requerido o ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El nombre del curso es requerido
 *       404:
 *         description: Curso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:idCurso', async (req, res) => {
  try {
    const { idCurso } = req.params;
    const { nombreCurso, fechaDesde, fechaHasta, fechaInicio, fechaFinalizacion } = req.body;

    const fechaDesdeNormalizada = typeof fechaDesde === 'string' && fechaDesde.trim() !== ''
      ? fechaDesde
      : (typeof fechaInicio === 'string' && fechaInicio.trim() !== '' ? fechaInicio : null);
    const fechaHastaNormalizada = typeof fechaHasta === 'string' && fechaHasta.trim() !== ''
      ? fechaHasta
      : (typeof fechaFinalizacion === 'string' && fechaFinalizacion.trim() !== '' ? fechaFinalizacion : null);

    // Validar ID
    if (!idCurso || isNaN(idCurso)) {
      return res.status(400).json({
        success: false,
        message: 'El ID del curso es inválido'
      });
    }

    // Validar que nombreCurso no esté vacío
    if (!nombreCurso || nombreCurso.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del curso es requerido'
      });
    }

    if (
      fechaDesdeNormalizada &&
      fechaHastaNormalizada &&
      new Date(fechaDesdeNormalizada) > new Date(fechaHastaNormalizada)
    ) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio no puede ser mayor que la fecha de finalización'
      });
    }

    const connection = await pool.getConnection();

    // Verificar que el curso existe
    const [cursoExistente] = await connection.execute(
      'SELECT idCurso FROM curso WHERE idCurso = ?',
      [idCurso]
    );

    if (cursoExistente.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Actualizar el curso
    try {
      await connection.execute(
        'UPDATE curso SET nombreCurso = ?, fechaDesde = ?, fechaHasta = ? WHERE idCurso = ?',
        [nombreCurso, fechaDesdeNormalizada, fechaHastaNormalizada, idCurso]
      );
    } catch (queryError) {
      if (queryError.code !== 'ER_BAD_FIELD_ERROR') {
        throw queryError;
      }

      try {
        await connection.execute(
          'UPDATE curso SET nombreCurso = ?, fechaInicio = ?, fechaFinalizacion = ? WHERE idCurso = ?',
          [nombreCurso, fechaDesdeNormalizada, fechaHastaNormalizada, idCurso]
        );
      } catch (legacyQueryError) {
        if (legacyQueryError.code !== 'ER_BAD_FIELD_ERROR') {
          throw legacyQueryError;
        }

        await connection.execute(
          'UPDATE curso SET nombreCurso = ? WHERE idCurso = ?',
          [nombreCurso, idCurso]
        );
      }
    }

    // Obtener el curso actualizado
    let cursoActualizado;

    try {
      [cursoActualizado] = await connection.execute(
        'SELECT idCurso, nombreCurso, fechaDesde, fechaHasta, fechaCreacion FROM curso WHERE idCurso = ?',
        [idCurso]
      );
    } catch (queryError) {
      if (queryError.code !== 'ER_BAD_FIELD_ERROR') {
        throw queryError;
      }

      try {
        [cursoActualizado] = await connection.execute(
          'SELECT idCurso, nombreCurso, fechaInicio, fechaFinalizacion, fechaCreacion FROM curso WHERE idCurso = ?',
          [idCurso]
        );
      } catch (legacyQueryError) {
        if (legacyQueryError.code !== 'ER_BAD_FIELD_ERROR') {
          throw legacyQueryError;
        }

        const [cursoActualizadoSinFechas] = await connection.execute(
          'SELECT idCurso, nombreCurso, fechaCreacion FROM curso WHERE idCurso = ?',
          [idCurso]
        );
        cursoActualizado = cursoActualizadoSinFechas.map((item) => ({
          ...item,
          fechaDesde: null,
          fechaHasta: null
        }));
      }
    }

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Curso actualizado exitosamente',
      curso: cursoActualizado[0]
    });

  } catch (error) {
    console.error('Error al actualizar curso:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el curso',
      error: error.message,
      details: error.code || 'Error desconocido'
    });
  }
});

/**
 * @swagger
 * /api/cursos/{idCurso}:
 *   delete:
 *     summary: Eliminar un curso por ID
 *     description: Elimina un curso existente de la base de datos por su ID
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: idCurso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Curso eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Curso eliminado exitosamente
 *                 idCurso:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El ID del curso es inválido
 *       404:
 *         description: Curso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:idCurso', async (req, res) => {
  try {
    const { idCurso } = req.params;

    // Validar ID
    if (!idCurso || isNaN(idCurso)) {
      return res.status(400).json({
        success: false,
        message: 'El ID del curso es inválido'
      });
    }

    const connection = await pool.getConnection();

    // Verificar que el curso existe
    const [cursoExistente] = await connection.execute(
      'SELECT idCurso FROM curso WHERE idCurso = ?',
      [idCurso]
    );

    if (cursoExistente.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Eliminar el curso
    await connection.execute(
      'DELETE FROM curso WHERE idCurso = ?',
      [idCurso]
    );

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Curso eliminado exitosamente',
      idCurso: parseInt(idCurso)
    });

  } catch (error) {
    console.error('Error al eliminar curso:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el curso',
      error: error.message,
      details: error.code || 'Error desconocido'
    });
  }
});

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crear un nuevo curso
 *     description: Crea un nuevo curso en la base de datos y retorna el ID asignado
 *     tags:
 *       - Cursos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCurso
 *             properties:
 *               nombreCurso:
 *                 type: string
 *                 description: Nombre del curso
 *                 example: Python Avanzado
 *                 minLength: 1
 *                 maxLength: 255
 *           examples:
 *             ejemplo1:
 *               summary: Crear un curso de programación
 *               value:
 *                 nombreCurso: "Python Avanzado"
 *             ejemplo2:
 *               summary: Crear un curso de diseño
 *               value:
 *                 nombreCurso: "Diseño UX Moderno"
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Curso creado exitosamente
 *                 idCurso:
 *                   type: integer
 *                   description: ID único del curso creado (auto-generado)
 *                   example: 1
 *                 nombreCurso:
 *                   type: string
 *                   example: Python Avanzado
 *             examples:
 *               exitoso:
 *                 summary: Respuesta exitosa
 *                 value:
 *                   success: true
 *                   message: Curso creado exitosamente
 *                   idCurso: 1
 *                   nombreCurso: Python Avanzado
 *       400:
 *         description: Error de validación - nombre del curso requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El nombre del curso es requerido
 *             examples:
 *               error_validacion:
 *                 summary: Campo requerido faltante
 *                 value:
 *                   success: false
 *                   message: El nombre del curso es requerido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al crear el curso
 *                 error:
 *                   type: string
 *                   example: Connection refused
 *             examples:
 *               error_servidor:
 *                 summary: Error de conexión a BD
 *                 value:
 *                   success: false
 *                   message: Error al crear el curso
 *                   error: Connection refused
 */
router.post('/', async (req, res) => {
  try {
    const { nombreCurso, fechaDesde, fechaHasta, fechaInicio, fechaFinalizacion } = req.body;

    const fechaDesdeNormalizada = typeof fechaDesde === 'string' && fechaDesde.trim() !== ''
      ? fechaDesde
      : (typeof fechaInicio === 'string' && fechaInicio.trim() !== '' ? fechaInicio : null);
    const fechaHastaNormalizada = typeof fechaHasta === 'string' && fechaHasta.trim() !== ''
      ? fechaHasta
      : (typeof fechaFinalizacion === 'string' && fechaFinalizacion.trim() !== '' ? fechaFinalizacion : null);

    // Validar que nombreCurso no esté vacío
    if (!nombreCurso || nombreCurso.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del curso es requerido'
      });
    }

    if (
      fechaDesdeNormalizada &&
      fechaHastaNormalizada &&
      new Date(fechaDesdeNormalizada) > new Date(fechaHastaNormalizada)
    ) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio no puede ser mayor que la fecha de finalización'
      });
    }

    // Insertar en la base de datos
    const connection = await pool.getConnection();
    let result;

    try {
      [result] = await connection.execute(
        'INSERT INTO curso (nombreCurso, fechaDesde, fechaHasta) VALUES (?, ?, ?)',
        [nombreCurso, fechaDesdeNormalizada, fechaHastaNormalizada]
      );
    } catch (queryError) {
      if (queryError.code !== 'ER_BAD_FIELD_ERROR') {
        throw queryError;
      }

      try {
        [result] = await connection.execute(
          'INSERT INTO curso (nombreCurso, fechaInicio, fechaFinalizacion) VALUES (?, ?, ?)',
          [nombreCurso, fechaDesdeNormalizada, fechaHastaNormalizada]
        );
      } catch (legacyQueryError) {
        if (legacyQueryError.code !== 'ER_BAD_FIELD_ERROR') {
          throw legacyQueryError;
        }

        [result] = await connection.execute(
          'INSERT INTO curso (nombreCurso) VALUES (?)',
          [nombreCurso]
        );
      }
    }
    
    connection.release();

    // Retornar el ID del curso creado
    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      idCurso: result.insertId,
      nombreCurso: nombreCurso,
      fechaDesde: fechaDesdeNormalizada,
      fechaHasta: fechaHastaNormalizada
    });

  } catch (error) {
    console.error('Error al crear curso:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al crear el curso',
      error: error.message,
      details: error.code || 'Error desconocido'
    });
  }
});

module.exports = router;
