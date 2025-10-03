'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Movie, MovieDetails } from '@/types/movie';
import { omdbApi, ApiError } from '@/services/omdbApi';
import { useDebounce } from '@/hooks/useDebounce';
import SearchInput from '@/components/SearchInput';
import MovieGrid from '@/components/MovieGrid';
import MovieDetailsModal from '@/components/MovieDetailsModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const MovieSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [, setAllMovies] = useState<Movie[]>([]);
  const [isShowingSuggestions, setIsShowingSuggestions] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Popular movie suggestions
  const popularMovies = [
    'Batman', 'Avengers', 'Spider-Man', 'Superman', 'Iron Man', 
    'The Dark Knight', 'Inception', 'Interstellar', 'Joker', 'Wonder Woman'
  ];

  const loadSuggestedMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsShowingSuggestions(true);

    try {
      const allSuggestedMovies: Movie[] = [];
      // Load popular movies in parallel for better performance
      const moviePromises = popularMovies.slice(0, 6).map(async (movieTitle) => {
        try {
          const response = await omdbApi.searchMovies(movieTitle, 1);
          return response.Search && response.Search.length > 0 ? response.Search[0] : null;
        } catch {
          // Continue with other movies if one fails
          console.log(`Failed to load ${movieTitle}`);
          return null;
        }
      });
      const results = await Promise.allSettled(moviePromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          allSuggestedMovies.push(result.value);
        }
      });

      // Remove duplicates
      const uniqueSuggestions = allSuggestedMovies.filter((movie, index, self) => 
        index === self.findIndex(m => m.imdbID === movie.imdbID)
      );

      setMovies(uniqueSuggestions);
      setAllMovies(uniqueSuggestions);
      setTotalResults(uniqueSuggestions.length);
    } catch {
      setError('Failed to load suggested movies');
    } finally {
      setIsLoading(false);
    }
  }, [popularMovies]);

  const searchMovies = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setMovies([]);
      setAllMovies([]);
      setTotalResults(0);
      setError(null);
      setCurrentPage(1);
      setIsShowingSuggestions(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsShowingSuggestions(false);

    try {
      const response = await omdbApi.searchMovies(query, page);
      // Remove duplicate movies based on imdbID
      const uniqueMovies = (response.Search || []).filter((movie, index, self) => 
        index === self.findIndex(m => m.imdbID === movie.imdbID)
      );
      
      if (page === 1) {
        setMovies(uniqueMovies);
        setAllMovies(uniqueMovies);
      } else {
        setAllMovies(prevAllMovies => {
          const newAllMovies = [...prevAllMovies, ...uniqueMovies];
          const finalUniqueMovies = newAllMovies.filter((movie, index, self) => 
            index === self.findIndex(m => m.imdbID === movie.imdbID)
          );
          setMovies(finalUniqueMovies);
          return finalUniqueMovies;
        });
      }
      
      setTotalResults(parseInt(response.totalResults) || 0);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while searching for movies.');
      }
      if (page === 1) {
        setMovies([]);
        setAllMovies([]);
        setTotalResults(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMovieClick = useCallback(async (movie: Movie) => {
    setIsLoadingDetails(true);
    setError(null);

    try {
      const details = await omdbApi.getMovieDetails(movie.imdbID);
      setSelectedMovie(details);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching movie details.');
      }
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setAllMovies([]);
  }, []);

  const loadMoreMovies = useCallback(() => {
    if (debouncedSearchTerm && !isLoading) {
      searchMovies(debouncedSearchTerm, currentPage + 1);
    }
  }, [debouncedSearchTerm, currentPage, isLoading, searchMovies]);

  // Load suggested movies on initial load
  React.useEffect(() => {
    loadSuggestedMovies();
  }, [loadSuggestedMovies]);

  // Effect to trigger search when debounced term changes
  React.useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchMovies(debouncedSearchTerm);
    } else {
      // If search is cleared, show suggestions again
      loadSuggestedMovies();
    }
  }, [debouncedSearchTerm, searchMovies, loadSuggestedMovies]);

  const maxPages = Math.ceil(totalResults / 10);
  const hasMoreMovies = currentPage < maxPages;

  const memoizedMovieGrid = useMemo(() => (
    <MovieGrid 
      movies={movies} 
      onMovieClick={handleMovieClick}
      isLoading={isLoadingDetails}
    />
  ), [movies, handleMovieClick, isLoadingDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Beautiful Header */}
        <header className="text-center mb-8 sm:mb-12 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 sm:mb-6 shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 8v10a2 2 0 002 2h14a2 2 0 002-2V8H3z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            CinemaSearch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Discover your next favorite movie from millions of titles worldwide
          </p>
        </header>

        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for movies like 'Batman', 'Avengers', 'Inception'..."
          disabled={isLoading}
        />

        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)} 
          />
        )}

        {isLoading && currentPage === 1 && (
          <LoadingSpinner text={isShowingSuggestions ? "Loading popular movies..." : "Searching movies..."} />
        )}

        {!error && movies.length > 0 && (
          <div className="mb-6 sm:mb-8 px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex-1">
                  {isShowingSuggestions ? (
                    <>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                        🎬 Popular Movies You Might Like
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Discover trending and popular movies
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                        Search Results for &quot;{debouncedSearchTerm}&quot;
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Showing {movies.length} of {totalResults.toLocaleString()} movies
                      </p>
                    </>
                  )}
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                  {isShowingSuggestions ? '✨ Suggestions' : `${totalResults.toLocaleString()} Results`}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && searchTerm && movies.length === 0 && !isShowingSuggestions && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No movies found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn&apos;t find any movies matching &quot;{debouncedSearchTerm}&quot;. Try a different search term or check your spelling.
            </p>
          </div>
        )}

        {!isLoading && !error && !searchTerm && movies.length === 0 && (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 8v10a2 2 0 002 2h14a2 2 0 002-2V8H3z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Welcome to CinemaSearch! 🎬</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mb-6 px-4">
              Start typing to search for your favorite movies, or browse our popular suggestions below.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto px-4">
              {popularMovies.slice(0, 8).map((movie, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(movie)}
                  className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-md"
                >
                  {movie}
                </button>
              ))}
            </div>
          </div>
        )}

        {memoizedMovieGrid}

        {/* Load More Button - Only show for search results, not suggestions */}
        {!isLoading && !isShowingSuggestions && hasMoreMovies && movies.length > 0 && (
          <div className="text-center mt-8 sm:mt-12 px-4">
            <button
              onClick={loadMoreMovies}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Load More Movies ({movies.length} of {totalResults})</span>
              <span className="sm:hidden">Load More ({movies.length}/{totalResults})</span>
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {isLoading && currentPage > 1 && (
          <div className="text-center mt-8">
            <LoadingSpinner size="sm" text="Loading more movies..." />
          </div>
        )}

        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
