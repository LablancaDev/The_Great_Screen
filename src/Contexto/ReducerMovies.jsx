import React from 'react';
import types from './types';

//* Reducer para la gestión de las valoraciones, visualizaciones y puntuación de las películas  

const ReducerMovies = (state, action) => {
  switch (action.type) {

    // Caso para actualizar el estado de visualización de una película (vista/no vista)
    case types.state_view:
      return {
        ...state,
        rate_movie: state.rate_movie.map(movie =>
          movie.id === action.payload.movieId
            ? { ...movie, visualization: action.payload.visualization }
            : movie
        )
      };

    // Caso para actualizar el comentario de una película
    case types.comment_movie:
      return {
        ...state,
        rate_movie: state.rate_movie.map(movie =>
          movie.id === action.payload.movieId
            ? { ...movie, comment: action.payload.comment }
            : movie
        )
      };

    // Caso para actualizar la valoración (rate) de una película
    case types.rating_movie:
      return {
        ...state,
        rate_movie: state.rate_movie.map(movie =>
          movie.id === action.payload.movieId
            ? { ...movie, rate: action.payload.rate }
            : movie
        )
      };

    default:
      return state;
  }
};

export default ReducerMovies;
