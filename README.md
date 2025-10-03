# Movie Search App

A React-based movie search application built with Next.js, TypeScript, and TailwindCSS that uses the OMDb API to search for movies and display detailed information.

## Features

- **Movie Search**: Search for movies using the OMDb API with debounced input
- **Movie Details**: Click on any movie to view detailed information including plot, cast, ratings, and more
- **Responsive Design**: Mobile-friendly interface built with TailwindCSS
- **Error Handling**: Graceful handling of API errors and missing data
- **Performance Optimized**: Uses React hooks like useMemo and useCallback for optimal performance
- **TypeScript**: Full type safety throughout the application

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OMDb API key (get one free at [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd assessment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OMDb API key:
```bash
NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with TailwindCSS
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── MovieSearch.tsx    # Main search component
│   ├── SearchInput.tsx    # Search input with debouncing
│   ├── MovieGrid.tsx      # Grid layout for movie results
│   ├── MovieCard.tsx      # Individual movie card
│   ├── MovieDetailsModal.tsx # Modal for movie details
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── ErrorMessage.tsx   # Error display component
├── hooks/                 # Custom React hooks
│   └── useDebounce.ts     # Debouncing hook
├── services/              # API services
│   └── omdbApi.ts         # OMDb API integration
└── types/                 # TypeScript type definitions
    └── movie.ts           # Movie-related types
```

## Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **TailwindCSS** - Utility-first CSS framework
- **OMDb API** - Movie database API

## API Usage

The app uses the OMDb API to fetch movie data. Make sure to:
1. Get a free API key from [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Add it to your `.env.local` file as `NEXT_PUBLIC_OMDB_API_KEY`
3. The app handles API rate limiting and error responses gracefully

## Performance Features

- **Debounced Search**: Reduces API calls by waiting 500ms after user stops typing
- **React Optimizations**: Uses useMemo and useCallback to prevent unnecessary re-renders
- **Lazy Loading**: Images are loaded on demand with loading states
- **Error Boundaries**: Graceful error handling throughout the application

## Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## License

This project is created for assessment purposes.
