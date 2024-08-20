// * RUTAS DE PELÍCULAS *

const express = require('express');

const router = express.Router();

const moviesController = require('../controllers/moviesController');

// * Rutas para mostrar las películas de diferentes categorías 

router.get('/popular', moviesController.getPopularMovies);

router.get('/toprated', moviesController.getTopRated)

router.get('/upcoming', moviesController.getUpComing)

router.get('/nowplaying', moviesController.getNowPlaying)

// * Rutas para gestionar las películas alquiladas por los usuarios en la DB de MYSQL o Turso 

router.post('/rent', moviesController.rentMovie)

router.get('/rented', moviesController.getRentedMovies);

router.delete('/delete/:id', moviesController.deleteMovie);

// * Rutas para gestionar las busquedas de películas al servidor
router.get('/search', moviesController.searchMovies)

// * Rutas para actualizar los datos de valoración, comentarios y visualización de las películas
router.put('/update/:id', moviesController.updateDataMovie)

module.exports = router;
