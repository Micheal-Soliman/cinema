import { Movie, MovieDetails, SearchResponse } from '@/types/movie';

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || 'your-api-key-here';
const BASE_URL = 'https://www.omdbapi.com/';

class OMDbApiService {
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(params: Record<string, string>): string {
    return JSON.stringify(params);
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async makeRequest(params: Record<string, string>): Promise<any> {
    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.get(cacheKey);
    
    // Return cached result if valid
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    const url = new URL(BASE_URL);
    url.searchParams.append('apikey', API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new ApiError({
          message: `HTTP error! status: ${response.status}`,
          status: response.status
        });
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        throw new ApiError({
          message: data.Error || 'Unknown API error',
          status: response.status
        });
      }

      // Cache the successful result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors, timeout, etc.
      throw new ApiError({
        message: error instanceof Error ? error.message : 'Network error occurred'
      });
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    if (!query.trim()) {
      throw new ApiError({ message: 'Search query cannot be empty' });
    }

    return this.makeRequest({
      s: query.trim(),
      page: page.toString(),
      type: 'movie'
    });
  }

  async getMovieDetails(imdbId: string): Promise<MovieDetails> {
    if (!imdbId) {
      throw new ApiError({ message: 'IMDb ID is required' });
    }

    return this.makeRequest({
      i: imdbId,
      plot: 'full'
    });
  }
}

// Create ApiError class
class ApiError extends Error {
  status?: number;

  constructor({ message, status }: { message: string; status?: number }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const omdbApi = new OMDbApiService();
export { ApiError };
