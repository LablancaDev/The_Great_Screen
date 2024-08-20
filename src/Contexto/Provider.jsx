import React, { useReducer } from 'react'
import MiReducer from './MiReducer'
import ReducerMovies from './ReducerMovies'
import Context from './Context'

export const Provider = ({ children }) => {

    // * LOGIN:

    const estadoInicial = {
        login: {
            user: "",
            password: "",
            isLoggedIn: false
        }
    }
    // useReducer que gestiona el estado completo del componente login 
    const [stateLogin, dispatch] = useReducer(MiReducer, estadoInicial)


    // * VALORACIÓN PELÍCULAS:

    const estadoInicialMovies = {
        rate_movie: [] 
    }
    // useReducer que gestiona el estado de valoración, comentarios y visualización de las películas
    const [movies, dispatch2] = useReducer(ReducerMovies, estadoInicialMovies);


    return (
        <Context.Provider value={{
            stateLogin, dispatch, movies, dispatch2
        }}>
            {children}
        </Context.Provider>
    )
}
