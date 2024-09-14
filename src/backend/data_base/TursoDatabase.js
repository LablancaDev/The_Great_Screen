// * DATA BASE TURSO

const { createClient } = require('@libsql/client');

const client = createClient({
    url: 'libsql://thegreatscreen-lablancadev.turso.io',
    authToken: process.env.TURSO_API_KEY
});

async function createTables() {
    // Crear tabla de usuarios
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `;

    // Crear tabla de películas alquiladas
    const createRentedMoviesTableQuery = `
      CREATE TABLE IF NOT EXISTS rented_movies (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        overview TEXT,
        poster_path TEXT,
        rate REAL,
        comment TEXT,
        visualization INTEGER DEFAULT 0
      )
    `;

    try {
        await client.execute(createUsersTableQuery);
        console.log('Tabla de usuarios creada con éxito');

        await client.execute(createRentedMoviesTableQuery);
        console.log('Tabla de películas alquiladas creada con éxito');
    } catch (error) {
        console.error('Error al crear las tablas:', error);
    }
}

createTables();

// module.exports: Utilizado en CommonJS, Es la forma tradicional de exportar en Node.js.
module.exports = client;

// export default client; exportación ES6 modules.
      
      
      
      