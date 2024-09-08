import React, { useContext, useEffect, useState } from 'react';
import Context from '../Contexto/Context';
import types from '../Contexto/types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    // Se usa el hook useContext para obtener el estado global y la función dispatch del contexto
    const { stateLogin, dispatch } = useContext(Context)

    // Importamos navigate para las redirecciones
    const navigate = useNavigate();

    // Extraemos del estadoInicial del reducer el valor del usuario y password para asignarlos al valor de los input 
    const usuario = stateLogin.login.user;
    const password = stateLogin.login.password;
    const email = stateLogin.login.email;

    // useState que almacena si estamos registrados o no, sólo se utiliza para cambiar los botones del formulario de inicio de sesión y registro
    const [isRegistered, setIsRegistered] = useState(false)
    const [message, setMessage] = useState('')

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

    const handleEmailChange = (e) => {
        dispatch({
            type: types.cambio_email,
            payload: e.target.value
        })
    }

    // Maneja el proceso de registro
    const handleRegister = async () => {
        const usuarioData = { usuario: usuario, password: password, email: email }; // Renombrado aquí
        console.log("Datos del registro: ", usuario, password, email)

        try {
            const response = await axios.post('http://localhost:5000/api/movies/register', usuarioData);
            dispatch({
                type: types.registrarse,
                payload: response.data
            })
            alert("Registro exitoso");
            console.log(response)
        } catch (error) {
            console.error('User registration error', error);
            alert("Hubo un problema con el registro: " + error.response.data.message);
        }
    };

    // Maneja el proceso de autenticación
    const handleAuth = async () => {
        const usuarioData = { usuario: usuario, password: password }
        console.log('Datos del usuario: ', usuarioData)
        try {
            const response = await axios.get('http://localhost:5000/api/movies/login', {
                params: usuarioData // Envía los datos como parámetros de consulta
            });
            dispatch({
                type: types.logearse, // Especifica el tipo de acción desde types
                payload: response.data
            })
            alert("Login exitoso");
            setMessage('Iniciando Sesión...')
            setTimeout(() => {
                setMessage(false)
            }, 2000);
        } catch (error) {
            console.error('User Login error', error);
            alert("Hubo un problema con el Login: " + error.response.data.message);
        }
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

        if (stateLogin.login.isLoggedIn) {
            setMessage('Iniciando sesión...');
            const timer = setTimeout(() => {
                setMessage('');
                navigate("/moviespage");
            }, 2000);

            return () => clearTimeout(timer);
        }

    }, [stateLogin.login.isLoggedIn])// Dependencia: Solo se ejecuta cuando `isLoggedIn` cambia (Cuando el usuario está logeado entonces se procederá a su redirección)


    return (
        <div className='container-fluid'>
            <div className="row min-vh-100 d-flex justify-content-center align-items-center">   {/*min-vh-100 en la fila (row): Esto hace que el contenedor de la fila ocupe al menos el 100% de la altura de la pantalla, permitiendo que el contenido se centre verticalmente.*/}
                <div className="col-12 col-md-6 col-lg-4">  {/*col-12 col-md-6 col-lg-4 en el contenedor del formulario: Usar estas clases en Bootstrap permite que el formulario tenga un ancho adecuado en diferentes tamaños de pantalla.*/}
                    <h3 className="text-center">{isRegistered ? 'Sign Up' : 'Login In'} Login</h3>
                    <div className='login d-flex flex-column p-4 bg-light bg-opacity-50'>
                        <label
                            htmlFor="usuario"
                            className='form-label text-start w-100'
                        >Name
                        </label>
                        <input
                            type="text"
                            id='usuario'
                            className='form-control w-100'
                            placeholder='Introduce tu nombre de usuario'
                            onChange={handleUserNameChange} // Llama a la función handleUserNameChange cada vez que cambia el valor del input
                            value={usuario}
                            required
                        />
                        <label
                            htmlFor="password"
                            className='form-label text-start w-100 mt-3'
                        >Password
                        </label>
                        <input
                            type="password"
                            id='password'
                            className='form-control w-100'
                            placeholder='Introduce tu contraseña'
                            onChange={handlePasswordChange} // Llama a la función handlePasswordNameChange cada vez que cambia el valor del input
                            value={password}
                            required
                        />
                        {isRegistered && (
                            <>
                                <label
                                    htmlFor="email"
                                    className='form-label text-start w-100 mt-3'
                                >E-mail
                                </label>
                                <input
                                    type="email"
                                    id='email'
                                    className='form-control w-100'
                                    placeholder='Introduce tu Email'
                                    onChange={handleEmailChange} // Llama a la función handlePasswordNameChange cada vez que cambia el valor del input
                                    value={email}
                                    required
                                />
                            </>
                        )}
                        {
                            isRegistered ? (
                                <div className='text-center'>
                                    <button onClick={handleRegister} className='btn btn-primary my-4 w-100'>Sign Up</button>
                                    <a className='text-center enlace' onClick={() => setIsRegistered(false)} type='text'>Already have an account</a>
                                </div>
                            ) : (
                                <div className='text-center'>
                                    <button onClick={handleAuth} className='btn btn-success my-4 w-100'>Log In</button>
                                    <a className='enlace' onClick={() => setIsRegistered(true)} type='text'>Create Account</a>
                                    <p className='text-success mt-4'>{message}</p>
                                </div>
                            )


                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
