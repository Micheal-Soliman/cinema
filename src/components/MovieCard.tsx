import React, { useState, memo } from 'react';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  disabled?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = memo(({ 
  movie, 
  onClick, 
  disabled = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div
      className={`
        group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden 
        transition-all duration-300 hover:shadow-xl hover:border-gray-200
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:-translate-y-2'}
      `}
      onClick={handleClick}
    >
      <div className="aspect-[3/4] relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        
        {!imageError && movie.Poster !== 'N/A' ? (
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
            decoding="async"
            className={`
              w-full h-full object-cover transition-all duration-500
              ${imageLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
              group-hover:scale-105
            `}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 mx-auto shadow-sm">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 8v10a2 2 0 002 2h14a2 2 0 002-2V8H3z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">No Image Available</p>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-gray-800">Click to view details</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {movie.Title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {movie.Year}
            </span>
            <span className="text-gray-500 text-xs font-medium capitalize">
              {movie.Type}
            </span>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
