// * CONTROLADOR DE PELÍCULAS

const axios = require('axios');
const { getDb } = require('../models/mysqlDatabase'); 
// const { getDb } = require('../models/dataBase');  Importa la conexión a TURSO

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

// Función para alquilar y solicitar los datos de la película mediante el id pasado en el cuerpo de la solicitud y almacenarla en la base de datos MySQL
const rentMovie = async (req, res) => {

    const movieId = req.body.movieId;

    try {
        const db = await getDb(); 

        const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const movie = response.data;

        const [result] = await db.execute(
            'INSERT INTO rented_movies (id, title, overview, poster_path) VALUES (?, ?, ?, ?)',
            [
                movie.id,
                movie.title,
                movie.overview,
                movie.poster_path,
            ]
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

// Función para recuperar las películas alquiladas de la base de datos 

const getRentedMovies = async (req, res) => { // Petición a la base de datos MYSQL
    try {
        const db = await getDb(); 
  
        const [rows] = await db.execute('SELECT * FROM rented_movies'); 
        res.json(rows); 

    } catch (error) {
        console.error('Error al obtener las películas alquiladas:', error);
        res.status(500).json({ message: 'Error al obtener las películas alquiladas' });
    }
}

// Función para eliminar una película de la base de datos
const deleteMovie = async (req, res) => {
    try {

        const db = getDb(); 

        const movieId = req.params.id; 

        const response = await db.execute("DELETE FROM rented_movies WHERE id = ?", [movieId])

        res.status(200).json({ message: 'Película eliminada exitosamente' });

    } catch (error) {
        console.error('Error al eliminar la película:', error);
        res.status(500).json({ message: 'Error al eliminar la película de la base de datos' });
    }
}

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

const updateDataMovie = async (req, res) => {   

    const db = await getDb(); 

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

      
        res.status(200).json({ message: 'Película actualizada con éxito' });
    } catch (error) {
        console.error('Error al actualizar la película:', error);
        res.status(500).json({ error: 'Error al actualizar la película' });
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
