import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';


const MoviesPage = () => {

  const [movies, setMovies] = useState([]); // Estado único para almacenar las películas actuales
  const [activeCategory, setActiveCategory] = useState('popular'); // Estado para manejar la categoría activa

  const [rentMovie, setRentMovie] = useState([]); // Estado que maneja las películas alquiladas de cada usuario

  // Estado que almacena el id de las películas alquiladas de cada usuario y mostrar el mensaje de (película vista)
  const [rentMovieId, setRentMovieId] = useState();

  // Estado que almacena el valor del título de la película mediante el buscador
  const [searchMovie, setSearchMovie] = useState('');


  // useEffect para cargar las películas populares al montar el componente
  useEffect(() => {
    fetchMovies('popular');
  }, []);


  // * Función para obtener las películas según la categoría seleccionada
  const fetchMovies = async (category) => {

    try {
      let endpoint = '';

      switch (category) {
        case 'popular':
          endpoint = 'http://localhost:5000/api/movies/popular';
          break;

        case 'topRated':
          endpoint = 'http://localhost:5000/api/movies/toprated';
          break;

        case 'upcoming':
          endpoint = 'http://localhost:5000/api/movies/upcoming';
          break;

        case 'nowplaying':
          endpoint = 'http://localhost:5000/api/movies/nowplaying';
          break;

        default:
          return;
      }

      const response = await axios.get(endpoint);
      setMovies(response.data.results);
      setActiveCategory(category);
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
    } finally {

    }
  };

  // * Función que realiza la petición de las películas alquiladas por el usuario, la idea es almacenar estos datos en la base de datos de MYSQL o Turso
  // y al mismo tiempo obtener los datos para mostrarlos en el front al usuario final 
  const selectMovie = async (id) => {
    try {

      const response = await axios.post(`http://localhost:5000/api/movies/rent`, { movieId: id });

      setRentMovie(response.data);

      setRentMovieId(id);
      console.log("Datos de la Película alquilada", rentMovie)
      console.log("Película alquilada:", response.data);
    } catch (error) {
      console.error('Error al alquilar la película:', error);
    }
  }

  // Función que se llama cada vez que el usuario escribe en el campo de búsqueda. Esta función actualiza el estado searchMovie
  const handleInputSearch = (e) => {
    setSearchMovie(e.target.value)
  }
  console.log(searchMovie)

  // Define la función de búsqueda con debounce
  // Utiliza useCallback para memorizar la función fetchSearchedMovies y evitar su recreación en cada renderizado
  const fetchSearchedMovies = useCallback(
    // La función de búsqueda está envuelta en debounce para limitar la frecuencia de las llamadas a la API
    debounce(async (query) => {

      try {

        const response = await axios.get('http://localhost:5000/api/movies/search', {
          params: { query }
        });

        setMovies(response.data.results);
      } catch (error) {

        console.error('Error fetching searched movies:', error);
      } finally {

      }
    }, 10), // El debounce retrasará la llamada a la función hasta que hayan pasado 10 ms desde la última vez que se activó
    []
  );

  // Utiliza useEffect para llamar a fetchSearchedMovies cuando searchMovie o activeCategory cambian
  useEffect(() => {
    if (searchMovie.trim() === '') {

      fetchMovies(activeCategory);
    } else {

      fetchSearchedMovies(searchMovie);
    }
  }, [searchMovie, fetchSearchedMovies, activeCategory]); // Dependencias de useEffect: se ejecutará cuando searchMovie, fetchSearchedMovies o activeCategory cambien


  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

  return (
    <div className='container-fluid containers'>
      <h1 className='text-center py-4'>

        {activeCategory === 'popular' && 'Popular Movies'}
        {activeCategory === 'topRated' && 'Top Rated Movies'}
        {activeCategory === 'upcoming' && 'Up coming Movies'}
        {activeCategory === 'nowplaying' && 'Now Playing Movies'}
      </h1>

      <div className='d-flex justify-content-center'>
        <input onChange={handleInputSearch} value={searchMovie} className="form-control me-2 w-50 bg-light bg-opacity-75 border-black" type="search" placeholder="Search your movie please" aria-label="Search" />
      </div>
      <div className='d-flex justify-content-around my-4'>

        <button className='btn btn-success' onClick={() => fetchMovies('popular')}>Popular Movies</button>
        <button className='btn btn-primary' onClick={() => fetchMovies('topRated')}>Top Rated Movies</button>
        <button className='btn btn-warning' onClick={() => fetchMovies('upcoming')}>Upcoming Movies</button>
        <button className='btn btn-danger' onClick={() => fetchMovies('nowplaying')}>Now Playing</button>
      </div>
      <div className="row p-3 gap-2 justify-content-center gap-5">

        {movies.map(movie => (
          <div
            onClick={() => selectMovie(movie.id)}
            className='card col-md-2 d-flex flex-column bg-light bg-opacity-50 card-movie'
            key={movie.id}
          >
            <img src={`${BASE_IMAGE_URL}${movie.poster_path}`} alt={movie.title} className='card-img-top' />
            <div className='card-body d-flex flex-column flex-grow-1 card-complete'>
              <h5 className='text-center mb-0'>{movie.title}</h5>
            </div>
            {rentMovieId === movie.id ? (
              <p className='bg-warning text-success text-center p-2 message_rent_movie'>Película Alquilada</p>
            ) : (
              <p></p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default MoviesPage;
