import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import types from '../Contexto/types';
import Context from '../Contexto/Context';

const MiFilmoteca = () => {

  // Estado Global recuperado del Contexto o Provider 
  const { movies, dispatch2 } = useContext(Context);


  // Estado local para almacenar las películas
  const [myMovies, setMyMovies] = useState([]);

  const [message, setMessage] = useState({});

  // useEffect para que se carguen todas mis películas alquiladas cuando se cree el componente
  useEffect(() => {
    recoveryMovies();
  }, []);

  // Recupera las películas alquiladas del servidor
  const recoveryMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies/rented');
      setMyMovies(response.data);
      console.log(myMovies)
    } catch (error) {
      console.error('Error al obtener la película:', error);
    }
  };

  // Función para eliminar una película
  const removeMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/movies/delete/${id}`)
      setMyMovies(myMovies.filter(movie => movie.id !== id))
      console.log("Película eliminada:", id);
    } catch (error) {
      console.error('Error al obtener la película:', error);
    }
  }

  // Actualiza el estado de una película específica 
  const updateMovieState = (id, field, value) => {

    setMyMovies(myMovies.map(movie =>
      movie.id === id ? { ...movie, [field]: value } : movie
    ));
  };

  // Maneja el cambio en la valoración
  const handleInputRating = (id, e) => {
    const newRate = e.target.value;
    updateMovieState(id, 'rate', newRate);
  };

  // Maneja el cambio en el comentario
  const handleTextArea = (id, e) => {
    const newComment = e.target.value;
    updateMovieState(id, 'comment', newComment);
  };

  // Actualiza si la película ha sido vista
  const clickMovieSeen = (id, isSeen) => {
    updateMovieState(id, 'visualization', isSeen);
  };

  // Función para enviar los datos actualizados de una película a la base de datos
  const handleSubmit = async (id) => {

    const movieToUpdate = myMovies.find(movie => movie.id === id);

    try {

      // Envía una solicitud PUT al servidor para actualizar la película en la base de datos
      await axios.put(`http://localhost:5000/api/movies/update/${id}`, movieToUpdate);

      // Despacha una acción para actualizar la valoración de la película en el estado global 
      dispatch2({
        type: types.rating_movie,
        payload: { movieId: id, rate: movieToUpdate.rate }
      });

      dispatch2({
        type: types.comment_movie,
        payload: { movieId: id, comment: movieToUpdate.comment }
      });

      dispatch2({
        type: types.state_view,
        payload: { movieId: id, visualization: movieToUpdate.visualization }
      });

      // Actualiza el mensaje SOLO para la película que fue actualizada
      setMessage(prevMessages => ({
        ...prevMessages,
        [id]: 'Película Actualizada Correctamente!'
      }));
      setTimeout(() => {
        setMessage(prevMessages => {
          const newMessages = { ...prevMessages };
          delete newMessages[id]; // Elimina el mensaje del estado
          return newMessages;
        });
      }, 2000); // 2 segundos

    } catch (error) {

      console.error('Error al actualizar la película:', error);
    }
    console.log('Datos enviados: ', movieToUpdate)
  };


  const TMDB_URL = 'https://image.tmdb.org/t/p/w500';

  return (
    <div className='container-fluid containers'>
      <h1 className='text-center my-4'>Mi Filmoteca</h1>
      <div className="row">
        {myMovies.map(movie => (
          <div className='col-md-3 mb-4' key={movie.id}>
            <div className='card bg-light bg-opacity-50' style={{ height: '100%' }}>
              <img src={`${TMDB_URL}${movie.poster_path}`} className='card-img-top' alt={movie.title} />
              {movie.visualization ? (
                <button onClick={() => clickMovieSeen(movie.id, false)} className='vista btn btn-success'>Watched</button>
              ) : (
                <button onClick={() => clickMovieSeen(movie.id, true)} className='vista btn btn-warning'>Unwatched</button>
              )}
              <div className='card-body d-flex flex-column'>
                <h5 className='card-title text-center text-truncate'>{movie.title}</h5>
                <button onClick={() => removeMovie(movie.id)} className='btn btn-danger'>Delete</button>
                <div className='d-flex justify-content-center align-items-center my-3'>
                  <label className='form-label me-2' htmlFor={`valoracion-${movie.id}`}>Rating: </label>
                  <input
                    onChange={(e) => handleInputRating(movie.id, e)}
                    className='form-control w-25 bg-success bg-opacity-50 me-2'
                    placeholder='1-10'
                    type="number"
                    id={`valoracion-${movie.id}`}
                    value={movie.rate || ''}
                  />
                </div>
                <div className='comentarios my-2'>
                  <label htmlFor={`coment-${movie.id}`}>Comments:</label>
                  <textarea
                    value={movie.comment || ''}
                    onChange={(e) => handleTextArea(movie.id, e)}
                    id={`coment-${movie.id}`}
                    cols="32"
                    rows="3"
                  ></textarea>
                  <div className='d-flex justify-content-center mt-2'>
                    <button onClick={() => handleSubmit(movie.id)} className='btn btn-success'>Submit Rating</button>
                  </div>
                  {/* Muestra el mensaje solo si hay un mensaje para esta película */}
                  {message[movie.id] && <p className='mt-2 text-center text-back'>{message[movie.id]}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiFilmoteca;
