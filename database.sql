-- Crear base de datos
CREATE DATABASE IF NOT EXISTS cursos_db;

-- Usar la base de datos
USE cursos_db;

-- Crear tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
  idCurso INT AUTO_INCREMENT PRIMARY KEY,
  nombreCurso VARCHAR(255) NOT NULL,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
