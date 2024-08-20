import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../paginas/Login'
import MoviesPage from '../paginas/MoviesPage'
import MiFilmoteca from '../paginas/MiFilmoteca'

function Router() {
  return (
    <>
    <Routes>
        <Route path='/' element={<MoviesPage />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/moviespage' element={<MoviesPage />}/>
        <Route path='/mifilmoteca' element={<MiFilmoteca />}/>
    </Routes>
    </>
  )
}

export default Router