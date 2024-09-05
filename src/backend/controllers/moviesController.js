// * CONTROLADOR DE PELÍCULAS

const axios = require('axios');
const { data_base_Mysql } = require('../data_base/mysqlDatabase'); 
const data_base_turso = require('../data_base/TursoDatabase');

const API_KEY = process.env.TMDB_API_KEY; 
const BASE_URL = 'https://api.themoviedb.org/3';

// * FUNCIONES PARA OBTENER LAS PELÍCULAS POR CATEGORÍAS Y MOSTRARLAS EN MoviesPage.jsx 

// Función para obtener las películas populares
const getPopularMovies = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener películas populares' });
    }
};

// Función para obtener las películas mejor calificadas
const getTopRated = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener películas mejor calificadas' });
    }
};

// Función para obtener las películas próximas a estrenarse
const getUpComing = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener películas próximas a estrenarse' });
    }
};

// Función para obtener las películas en cartelera
const getNowPlaying = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener películas en cartelera' });
    }
};

// * FUNCIONES PARA GESTIONAR LAS PELÍCULAS ALQUILADAS POR EL USUARIO (INSERTAR/MOSTRAR)

// Función para alquilar y solicitar los datos de la película mediante el id pasado en el cuerpo de la solicitud y almacenarla en ambas bases de datos
const rentMovie = async (req, res) => {
    const movieId = req.body.movieId;

    try {
        // Obtener información de la película
        const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const movie = response.data;

        // Insertar en la base de datos MySQL
        const db = await data_base_Mysql(); 
        await db.execute(
            'INSERT INTO rented_movies (id, title, overview, poster_path) VALUES (?, ?, ?, ?)',
            [
                movie.id,
                movie.title,
                movie.overview,
                movie.poster_path,
            ]
        );

        // Insertar en la base de datos Turso
        await data_base_turso.execute(
            'INSERT INTO rented_movies (id, title, overview, poster_path, rate, comment, visualization) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [movie.id, movie.title, movie.overview, movie.poster_path, null, null, 0] // Asumiendo valores por defecto
        );

        res.json({
            message: "Película alquilada exitosamente",
            movie: movie
        });
    } catch (error) {
        console.error('Error al alquilar la película:', error);
        res.status(500).json({ message: 'Error al alquilar la película' });
    }
};

// Función para recuperar las películas alquiladas de ambas bases de datos
const getRentedMovies = async (req, res) => {
    try {
        const db = await data_base_Mysql(); 
        const [rows] = await db.execute('SELECT * FROM rented_movies'); 
        res.json(rows); 
    } catch (error) {
        console.error('Error al obtener las películas alquiladas:', error);
        res.status(500).json({ message: 'Error al obtener las películas alquiladas' });
    }
};

// Función para eliminar una película de ambas bases de datos
const deleteMovie = async (req, res) => {
    const movieId = req.params.id;

    try {
        const db = await data_base_Mysql(); 
        await db.execute("DELETE FROM rented_movies WHERE id = ?", [movieId]);

        await data_base_turso.execute("DELETE FROM rented_movies WHERE id = ?", [movieId]);

        res.status(200).json({ message: 'Película eliminada exitosamente de ambas bases de datos' });
    } catch (error) {
        console.error('Error al eliminar la película:', error);
        res.status(500).json({ message: 'Error al eliminar la película de las bases de datos' });
    }
};

// Función para buscar las películas en la base de datos mediante el buscador del Front
const searchMovies = async (req, res) => {
    const query = req.query.query; 
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: { 
                api_key: API_KEY, 
                query: query 
            }
        });
 
        res.json(response.data);
    } catch (error) {
        console.error('Error al buscar la película:', error);
        res.status(500).json({ message: 'Error en la búsqueda de la película en la base de datos' });
    }
};

// Función para actualizar los datos de la película en ambas bases de datos
const updateDataMovie = async (req, res) => {   
    const db = await data_base_Mysql(); 
    const { id } = req.params;
    const { rate, comment, visualization } = req.body;

    try {
        const query = `
          UPDATE rented_movies 
          SET 
            rate = ?, 
            comment = ?, 
            visualization = ? 
          WHERE id = ?`;

        await db.execute(query, [rate, comment, visualization, id]);
        
        // Actualización en Turso
        await data_base_turso.execute(query, [rate, comment, visualization, id]);

        res.status(200).json({ message: 'Película actualizada con éxito en ambas bases de datos' });
    } catch (error) {
        console.error('Error al actualizar la película:', error);
        res.status(500).json({ error: 'Error al actualizar la película en las bases de datos' });
    } 
}

module.exports = {
    getPopularMovies,
    getTopRated,
    getUpComing,
    getNowPlaying,
    rentMovie,
    getRentedMovies,
    deleteMovie,
    searchMovies,
    updateDataMovie
};
