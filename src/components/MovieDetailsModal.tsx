import React, { useEffect } from 'react';
import { MovieDetails } from '@/types/movie';

interface MovieDetailsModalProps {
  movie: MovieDetails;
  onClose: () => void;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col transform-gpu">
        <div className="bg-white border-b border-gray-100 p-4 sm:p-6 flex justify-between items-center rounded-t-2xl sm:rounded-t-3xl flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate pr-2 sm:pr-4">
              {movie.Title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{movie.Year} • {movie.Genre}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 smooth-scroll">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <div className="relative group">
                  <img
                    src={movie.Poster}
                    alt={`${movie.Title} poster`}
                    className="w-full rounded-2xl shadow-2xl will-change-transform"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-md">
                      <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 8v10a2 2 0 002 2h14a2 2 0 002-2V8H3z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Movie Details */}
            <div className="md:col-span-2 space-y-4 sm:space-y-6">
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  {movie.Year}
                </span>
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  {movie.Rated}
                </span>
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  {movie.Runtime}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Genre</h3>
                <p className="text-sm sm:text-base text-gray-700">{movie.Genre}</p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Plot</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{movie.Plot}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Director</h3>
                  <p className="text-sm sm:text-base text-gray-700">{movie.Director}</p>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Released</h3>
                  <p className="text-sm sm:text-base text-gray-700">{movie.Released}</p>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Cast</h3>
                <p className="text-sm sm:text-base text-gray-700">{movie.Actors}</p>
              </div>

              {movie.Ratings && movie.Ratings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ratings</h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.Ratings.map((rating, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{rating.Source}</p>
                        <p className="text-lg font-bold text-blue-600">{rating.Value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie.Awards && movie.Awards !== 'N/A' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Awards</h3>
                  <p className="text-gray-700">{movie.Awards}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Language:</span>
                  <span className="text-gray-700 ml-2">{movie.Language}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Country:</span>
                  <span className="text-gray-700 ml-2">{movie.Country}</span>
                </div>
                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <div>
                    <span className="font-medium text-gray-900">Box Office:</span>
                    <span className="text-gray-700 ml-2">{movie.BoxOffice}</span>
                  </div>
                )}
                {movie.Production && movie.Production !== 'N/A' && (
                  <div>
                    <span className="font-medium text-gray-900">Production:</span>
                    <span className="text-gray-700 ml-2">{movie.Production}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
