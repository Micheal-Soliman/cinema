import React, { memo } from 'react';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  isLoading?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = memo(({ 
  movies, 
  onMovieClick, 
  isLoading = false 
}) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onClick={() => onMovieClick(movie)}
          disabled={isLoading}
        />
      ))}
    </div>
  );
});

MovieGrid.displayName = 'MovieGrid';

export default MovieGrid;
