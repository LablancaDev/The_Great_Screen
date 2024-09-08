// loginController.js

const { createUser, findUserByEmail, checkLoginUser } = require('../models/loginModel');
// loginController.js

const registerNewUser = async (req, res) => {
    const { usuario, password, email } = req.body;

    try {
        // Verifica si el usuario ya existe
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Verifica que todos los campos sean proporcionados
        if (!usuario || !password || !email) {
            return res.status(400).json({ message: "No puede registrarse sin rellenar los campos" });
        }

        // Verifica el formato del email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "El formato del email no es válido" });
        }

        // Verifica la longitud de la contraseña
        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }

        // Crea el nuevo usuario
        const newUser = await createUser(usuario, password, email);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

const loginUser = async (req, res) => {
    const { usuario, password } = req.query;
    try {
        // Busca al usuario por nombre
        const existingUser = await checkLoginUser(usuario, password);
        if (!existingUser) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Aquí verifica que la contraseña coincida
        if (existingUser.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Login exitoso', usuario: existingUser });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};





module.exports = {
    registerNewUser,
    loginUser,
    // ... otras funciones
};
