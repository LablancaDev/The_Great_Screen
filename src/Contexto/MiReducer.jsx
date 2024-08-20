import React from 'react'
import types from './types';

//* Reducer para la gestión del login  

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
        case types.registrarse:
           
            localStorage.setItem('user', JSON.stringify({ 
                user: state.login.user,
                password: state.login.password

            
            }))
            alert("Registro exitoso, ahora puedes iniciar sesión");
            return state;

        case types.logearse:
           
            const storedUser = JSON.parse(localStorage.getItem('user'))
         
            if (storedUser && storedUser.user === state.login.user && storedUser.password === state.login.password) {
              
                return {
                    ...state, 
                    login: {
                  
                        ...state.login,
                        isLoggedIn: true,
                    }
                }
               
            } else {
                alert("Usuario o contraseña incorrectos");
                return state;
            }

        default:
            return state;
    }

}

export default MiReducer