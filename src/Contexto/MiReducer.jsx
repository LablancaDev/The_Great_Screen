import React from 'react';
import types from './types';

const MiReducer = (state, action) => {
    switch (action.type) {
        case types.cambio_usuario:
            return {
                ...state,
                login: {
                    ...state.login,
                    user: action.payload
                }
            }
        case types.cambio_contraseña:
            return {
                ...state,
                login: {
                    ...state.login,
                    password: action.payload
                }
            }
        case types.cambio_email:
            return {
                ...state,
                login: {
                    ...state.login,
                    email: action.payload
                }
            }
        case types.registrarse:
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            storedUsers.push({
                user: state.login.user,
                password: state.login.password,
                email: state.login.email
            });
            localStorage.setItem('users', JSON.stringify(storedUsers));
            alert("Registro exitoso, ahora puedes iniciar sesión");
            return state;

        case types.logearse:
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userFound = users.find(user => user.user === state.login.user && user.password === state.login.password);

            if (userFound) {
                return {
                    ...state,
                    login: {
                        ...state.login,
                        isLoggedIn: true,
                        error: null // Resetear el error si se logra iniciar sesión
                    }
                };
            } else {
                return {
                    ...state,
                    login: {
                        ...state.login,
                        error: "Usuario o contraseña incorrectos" // Almacena el error
                    }
                };
            }

        default:
            return state;
    }
}

export default MiReducer;
