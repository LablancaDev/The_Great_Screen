const data_base_Mysql = require('../data_base/mysqlDatabase');
const data_base_Turso = require('../data_base/TursoDatabase');

const createUser = async (usuario, password, email) => {
    // Consulta MySQL comentada
    // const queryMysql = 'INSERT INTO users (user, password, email) VALUES (?, ?, ?)';
    const queryTurso = 'INSERT INTO users (user, password, email) VALUES (' + 
        `'${usuario}', '${password}', '${email}')`; // Consulta Turso sin preparación

    try {
        const dbMysql = await data_base_Mysql();
        // await dbMysql.execute(queryMysql, [usuario, password, email]); // Comentado

        // Ya no se necesita llamar como función
        await data_base_Turso.execute(queryTurso);

        console.log('User added successfully');
        return { usuario, email };
    } catch (error) {
        console.error('Error adding user to the database', error);
        throw new Error('Database insert error: ' + error.message);
    }
};

const findUserByEmail = async (email) => {
    // Consulta MySQL comentada
    // const queryMysql = 'SELECT * FROM users WHERE email = ?';
    const queryTurso = 'SELECT * FROM users WHERE email = \'' + email + '\''; // Consulta Turso sin preparación

    try {
        // Consulta en MySQL
        const dbMysql = await data_base_Mysql();
        // const [rows] = await dbMysql.execute(queryMysql, [email]); // Comentado

        // Si se encuentra un usuario en MySQL, lo devolvemos
        // if (rows.length > 0) {
        //     return rows[0];
        // }

        // Consulta en Turso
        const result = await data_base_Turso.execute(queryTurso);

        // Verifica si el resultado tiene una estructura adecuada (por ejemplo, 'rows')
        // Dependiendo de cómo se devuelven los datos en Turso
        if (result && result.rows && result.rows.length > 0) {
            return result.rows[0];
        }

        return null; // No se encontró ningún usuario en ambas bases de datos
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Database query error: ' + error.message);
    }
};

const checkLoginUser = async (usuario, password) => {
    // Consulta MySQL comentada
    // const queryMysql = 'SELECT * FROM users WHERE user = ?';
    const queryTurso = 'SELECT * FROM users WHERE user = \'' + usuario + '\''; // Consulta Turso sin preparación

    try {
        // Consulta en MySQL
        const dbMysql = await data_base_Mysql();
        // const [rows] = await dbMysql.execute(queryMysql, [usuario]); // Comentado

        // if (rows.length > 0) {
        //     return rows[0];
        // }

        // Consulta en Turso
        const result = await data_base_Turso.execute(queryTurso);
        if (result && result.rows && result.rows.length > 0) {
            return result.rows[0];
        }

        return null; // No se encontró el usuario en ambas bases de datos
    } catch (error) {
        console.error('Error al verificar el usuario:', error);
        throw new Error('Database query error: ' + error.message);
    }
}

module.exports = {
    createUser,
    findUserByEmail,
    checkLoginUser
};
