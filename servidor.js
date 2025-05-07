const { MongoClient } = require('mongodb');

async function verificarLogin(nombre, contrasena) {
  const uri = 'mongodb+srv://bfanvei:Lolitofernandez10@cluster0.3swo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('citas-medicas');
    const login = db.collection('login');

    const usuario = await login.findOne({ nombre, contrasena });

    if (usuario) {
      console.log('Login exitoso');
      // Aquí puedes iniciar algo más, redirigir, etc.
    } else {
      console.log('Credenciales incorrectas');
    }
  } catch (err) {
    console.error('Error al conectar:', err);
  } finally {
    await client.close();
  }
}

// Ejecuta una prueba de login
verificarLogin('admin', '1234');