import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]); // Estado para almacenar las películas actuales
  const [activeCategory, setActiveCategory] = useState('popular'); // Estado para manejar la categoría activa
  const [rentedMovies, setRentedMovies] = useState([]); // Estado que maneja las películas alquiladas
  const [searchMovie, setSearchMovie] = useState(''); // Estado que almacena el valor del título de la película mediante el buscador

  // useEffect para cargar las películas populares al montar el componente, además carga las películas alquiladas
  useEffect(() => {
    fetchMovies('popular');
    fetchRentedMovies();
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
    }
  };

  // * Función para obtener las películas alquiladas desde el servidor
  const fetchRentedMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies/rented'); 
      setRentedMovies(response.data.map(movie => movie.id)); //Aquí guardamos solo los IDs de las películas alquiladas
      console.log('ids pelis: ', response.data.map(movie => movie.id))
    } catch (error) {
      console.error('Error fetching rented movies:', error);
    }
  };

  // * Función llamada mediante click para alquilar la película seleccionada e insertarla en la DB
  // Actualiza el estado local con la nueva película alquilada sin necesidad de hacer otra petición al servidor, para que el usuario vea inmediatamente el cambio
  const selectMovie = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/movies/rent`, { movieId: id });
      setRentedMovies((prevRentedMovies) => [...prevRentedMovies, id]); // Actualizar estado local con la nueva película añadida
      console.log("Película alquilada:", response.data);
      console.log('ids: ', rentedMovies)
    } catch (error) {
      console.error('Error al alquilar la película:', error);
    }
  };

  // Función que se llama cada vez que el usuario escribe en el campo de búsqueda
  const handleInputSearch = (e) => {
    setSearchMovie(e.target.value);
  };

  // Define la función de búsqueda con debounce
  const fetchSearchedMovies = useCallback(
    debounce(async (query) => {
      try {
        const response = await axios.get('http://localhost:5000/api/movies/search', {
          params: { query }
        });
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching searched movies:', error);
      }
    }, 300), // El debounce retrasará la llamada a la función hasta que hayan pasado 300 ms
    []
  );

  // Utiliza useEffect para llamar a fetchSearchedMovies cuando searchMovie o activeCategory cambian
  useEffect(() => {
    if (searchMovie.trim() === '') {
      fetchMovies(activeCategory);
    } else {
      fetchSearchedMovies(searchMovie);
    }
  }, [searchMovie, fetchSearchedMovies, activeCategory]);

 
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

  return (
    <div className='container-fluid containers'>
      <h1 className='text-center py-4 text-warning'>
        {activeCategory === 'popular' && 'Popular Movies'}
        {activeCategory === 'topRated' && 'Top Rated Movies'}
        {activeCategory === 'upcoming' && 'Up coming Movies'}
        {activeCategory === 'nowplaying' && 'Now Playing Movies'}
      </h1>

      <div className='d-flex justify-content-center'>
        <input 
          onChange={handleInputSearch} 
          value={searchMovie} 
          className="form-control me-2 w-50 bg-light bg-opacity-75 border-black" 
          type="search" 
          placeholder="Search your movie please" 
          aria-label="Search" 
        />
      </div>

      <div className='d-flex justify-content-around my-4 gap-2'>
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
            {rentedMovies.includes(movie.id) ? (
              <p className='text-center p-2 rounded message_rent_movie'>Rented Movie</p>
            ) : (
              <p className='text-primary'>Click to rent the movie...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
