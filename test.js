// Archivo para probar la API desde Node.js
// Ejecuta: node test.js

const http = require('http');

const data = JSON.stringify({
  nombreCurso: 'Curso de Prueba'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/cursos',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('\n=== RESPUESTA DE LA API ===');
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', res.headers);
    console.log('Body:', JSON.parse(body));
    console.log('========================\n');
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

// Enviar datos
req.write(data);
req.end();
