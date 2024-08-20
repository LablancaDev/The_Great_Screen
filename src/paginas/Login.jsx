import React, { useContext, useEffect, useState } from 'react';
import Context from '../Contexto/Context';
import types from '../Contexto/types';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    // Se usa el hook useContext para obtener el estado global y la función dispatch del contexto
    const { stateLogin, dispatch } = useContext(Context)

    // Importamos navigate para las redirecciones
    const navigate = useNavigate();

    // Extraemos del estadoInicial del reducer el valor del usuario y password para asignarlos al valor de los input 
    const usuario = stateLogin.login.user;
    const password = stateLogin.login.password;

    // useState que almacena si estamos registrados o no, sólo se utiliza para cambiar los botones del formulario de inicio de sesión y registro
    const [isRegistered, setIsRegistered] = useState(false)

    // Maneja el cambio del nombre de usuario, IMPORTANTE CON EL DISPATCH USO UN OBJETO POR QUE ESTOY MODIFICANDO EL MISMO OBJETO DEL ESTADO INICIAL EN Provider.jsx
    const handleUserNameChange = (e) => {
        dispatch({ // Despacha una acción al reducer para cambiar el nombre de usuario
            type: types.cambio_usuario, // Especifica el tipo de acción desde types
            payload: e.target.value // Pasa el valor del input como payload de la acción
        })
    }
    // Maneja el cambio de la contraseña
    const handlePasswordChange = (e) => {
        dispatch({
            type: types.cambio_contraseña,
            payload: e.target.value
        })
    }
    // Maneja el proceso de registro
    const handleRegister = () => {
        dispatch({
            type: types.registrarse, // Especifica el tipo de acción desde types
        })
    }
    // Maneja el proceso de autenticación
    const handleAuth = () => {
        dispatch({
            type: types.logearse // Especifica el tipo de acción desde types
        })
    }

    /*Para asegurarte de que estás verificando el valor actualizado de isLoggedIn después de que el estado haya cambiado, 
    debes usar useEffect para observar los cambios en stateLogin.login.isLoggedIn.
    
    Despacho de Acción (dispatch): Cuando llamas a dispatch, React programará una actualización del estado en un futuro cercano. 
    Esta actualización no es instantánea y se produce en el siguiente ciclo de renderizado.

    Verificación Inmediata de stateLogin.login.isLoggedIn: Inmediatamente después de despachar la acción (dispatch), estás verificando el 
    valor de stateLogin.login.isLoggedIn. El problema aquí es que en ese preciso momento, es muy probable que stateLogin.login.isLoggedIn 
    aún no haya sido actualizado porque la actualización del estado ocurre asíncronamente.*/

    // Este efecto se ejecuta cada vez que `stateLogin.login.isLoggedIn` cambia
    useEffect(() => {
        if (stateLogin.login.isLoggedIn) { //Se accede desde el useReducer a isLoggedIn dentro del estadoInicial, cuando isLoggedIn pase a true redirige al user      
            navigate("/moviespage")
        }

    }, [stateLogin.login.isLoggedIn])// Dependencia: Solo se ejecuta cuando `isLoggedIn` cambia (Cuando el usuario está logeado entonces se procederá a su redirección)


    return (
        <div className='container-fluid'>
            <div className="row min-vh-100 d-flex justify-content-center align-items-center">   {/*min-vh-100 en la fila (row): Esto hace que el contenedor de la fila ocupe al menos el 100% de la altura de la pantalla, permitiendo que el contenido se centre verticalmente.*/}
                <div className="col-12 col-md-6 col-lg-4">  {/*col-12 col-md-6 col-lg-4 en el contenedor del formulario: Usar estas clases en Bootstrap permite que el formulario tenga un ancho adecuado en diferentes tamaños de pantalla.*/}
                    <h3 className="text-center">Login</h3>
                    <div className='login d-flex flex-column p-4 bg-light bg-opacity-50'>
                        <label
                            htmlFor="usuario"
                            className='form-label text-start w-100'
                        >Nombre
                        </label>
                        <input
                            type="text"
                            id='usuario'
                            className='form-control w-100'
                            placeholder='Introduce tu nombre de usuario'
                            onChange={handleUserNameChange} // Llama a la función handleUserNameChange cada vez que cambia el valor del input
                            value={usuario}
                        />
                        <label
                            htmlFor="password"
                            className='form-label text-start w-100 mt-3'
                        >Contraseña
                        </label>
                        <input
                            type="password"
                            id='password'
                            className='form-control w-100'
                            placeholder='Introduce tu contraseña'
                            onChange={handlePasswordChange} // Llama a la función handlePasswordNameChange cada vez que cambia el valor del input
                            value={password}
                        />
                        {
                            isRegistered ? (
                                <>
                                    <button onClick={handleRegister} className='btn btn-primary mt-4 w-100'>Registrarse</button>
                                    <a className='text-center enlace mt-3' onClick={() => setIsRegistered(false)} type='text'>Ya Tengo Cuenta</a>
                                </>

                            ) : (
                                <>
                                    <button onClick={handleAuth} className='btn btn-success mt-4 w-100'>Iniciar sesión</button>
                                    <a className='text-center enlace mt-3' onClick={() => setIsRegistered(true)} type='text'>Crear Cuenta</a>
                                </>
                            )


                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
